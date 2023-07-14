const blog = require('../model/blog_model');
const comment = require('../model/comment_model')
const path = require('path');
const fs = require('fs');
const express = require('express');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.Addblog = async (req, res) => {
    return res.render('blog');

}
module.exports.insertRecornd = async (req, res) => {
    try {
        let imgpath = '';
        if (req.file) {
            imgpath = blog.avtharpath + "/" + req.file.filename;
        }
        req.body.image = imgpath;
        req.body.name = req.user.name;

        let anyDate = new Date();
        req.body.date = anyDate.toShortFormat();

        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;

        let data = await blog.create(req.body);
        if (data) {
            res.redirect('/blog');
        }
    } catch (err) {
        console.log("Add blog is err", err)
    }

}

Date.prototype.toShortFormat = function () {

    const monthNames = ["Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];

    const day = this.getDate();

    const monthIndex = this.getMonth();
    const monthName = monthNames[monthIndex];

    const year = this.getFullYear();

    return `${day}-${monthName}-${year}`;
}

module.exports.blogview = async (req, res) => {
    try {
        if (req.query.status == 'deActive') {
            let Active = await blog.findByIdAndUpdate(req.query.id, { isActive: false })
        }
        if (req.query.status == 'Active') {
            let Active = await blog.findByIdAndUpdate(req.query.id, { isActive: true })
        }


        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        var page = 1;
        if (req.query.page) {
            page = req.query.page
        }

        var per_page = 2;


        let data = await blog.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { date: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } },
                { category: { $regex: '.*' + search + '.*', $options: 'i' } },

            ]
        }).limit(per_page * 1)
            .skip((page - 1) * per_page)
            .exec();


        let data_count = await blog.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { date: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } },
                { category: { $regex: '.*' + search + '.*', $options: 'i' } },

            ]
        }).countDocuments();

        let pageNum = Math.ceil(data_count / per_page)

        if (data) {
            res.render('blog_view', ({
                blogData: data,
                pageNum: pageNum,
                cpage: page,
                search: search
            }))
        }
    } catch (error) {
        console.log("blog view page is error:",error)
    }
}

module.exports.DeleteRecord = async (req, res)=>{
    try {
        let data = await blog.findById(req.params.id);
        if(data){
            let img = path.join(__dirname,'..',data.image);
            if(img){
                fs.unlinkSync(img);
            }
            let delet = await blog.findByIdAndDelete(req.params.id);
            if(delet){
               return res.redirect('/blog/blog_view');
            }

        }
    } catch (error) {
        console.log("blog delete :",error)
    }
}

module.exports.UpdateRecord = async (req,res)=>{
    try {
        let data = await blog.findById(req.params.id);
        if(data){
            res.render('blog_update',({data:data}))
        }
    } catch (error) {
        console.log("blog Update page error:",error);
    }
}
module.exports.EditRecord = async (req,res)=>{
    try {
        let id = req.body.editId;
        let data = await blog.findById(id);
        if(data){
            if(req.file){
                let imgpath = path.join(__dirname,'..',data.image);
                fs.unlinkSync(imgpath)

                let newimg = blog.avtharpath+"/"+req.file.filename;
                req.body.image = newimg

                req.body.updatedAt = nDate;

                let upadate = await blog.findByIdAndUpdate(id,req.body);
                return res.redirect('/blog/blog_view');

            }else{
                req.body.image = data.image;
                let nDate = new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Calcutta'
                });

                req.body.updatedAt = nDate;
                let upadate = await blog.findByIdAndUpdate(id,req.body);
                if(upadate){
                    return res.redirect('/blog/blog_view');
                }
            }
        }
    } catch (error) {
        console.log("blog EditRecord erroor",error);
    }
}

module.exports.mulDel = async (req,res)=>{
    try {
        let data = req.body.DeleteRecord;
        data.forEach(async element => {
            let id_data = await blog.findById(element);

            let img = path.join(__dirname,'..', id_data.image);
            fs.unlinkSync(img);

            await blog.findByIdAndUpdate(element);
        });
        return res.redirect('/blog/blog_view')
    } catch (error) {
        console.log("Multi Delete error",error);
    }
}



// / comment
module.exports.view_comment = async (req, res) => {
    
    if (req.query.status == 'deActive') {
        let Active = await comment.findByIdAndUpdate(req.query.id, { isActive: false });
    }

    if (req.query.status == 'Active') {
        let Active = await comment.findByIdAndUpdate(req.query.id, { isActive: true });
    }

    let search = '';
    if (req.query.search) {
        search = req.query.search;
    }

    let page = 1;
    if (req.query.page) {
        page = req.query.page;
    }

    let page_num = await comment.find({
        $or: [
            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
            { date: { $regex: '.*' + search + '.*', $options: 'i' } },
            { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        ]
    }).countDocuments();
    let per_page = 2;
    let t_page = Math.ceil(page_num / per_page);

    let comment_data = await comment.find({
        $or: [
            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
            { date: { $regex: '.*' + search + '.*', $options: 'i' } },
            { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        ]
    })
        .populate('post_id')
        .limit(per_page * 1)
        .skip((page - 1) * per_page)
        .exec();

    return res.render('comment_view',
        ({
            comment: comment_data,
            search: search,
            page: page,
            cpage: page,
            page_num: t_page
        }))
}