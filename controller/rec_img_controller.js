const express = require('express');
const path = require('path');
const fs = require('fs');
const rec_img = require('../model/rec_img_model');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.Add_rec_img = async (req, res) => {
    return res.render('rec_img');

}
module.exports.insertRecornd = async (req, res) => {
    try {
        let imgpath = '';
        if (req.file) {
            imgpath = rec_img.avtharpath + "/" + req.file.filename;
        }
        req.body.image = imgpath;

        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;

        let data = await rec_img.create(req.body);
        if (data) {
            res.redirect('/rec_img');
        }
    } catch (err) {
        console.log("Add rec_img is err", err)
    }

}
module.exports.rec_imgview = async (req, res) => {
    try {
        if (req.query.status == 'deActive') {
            let Active = await rec_img.findByIdAndUpdate(req.query.id, { isActive: false })
        }
        if (req.query.status == 'Active') {
            let Active = await rec_img.findByIdAndUpdate(req.query.id, { isActive: true })
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


        let data = await rec_img.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }

            ]
        }).limit(per_page * 1)
            .skip((page - 1) * per_page)
            .exec();


        let data_count = await rec_img.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }

            ]
        }).countDocuments();

        let pageNum = Math.ceil(data_count / per_page)

        if (data) {
            res.render('rec_img_view', ({
                rec_img: data,
                pageNum: pageNum,
                cpage: page,
                search: search
            }))
        }
    } catch (error) {
        console.log("rec_img view page is error:",error)
    }
}

module.exports.DeleteRecord = async (req, res)=>{
    try {
        let data = await rec_img.findById(req.params.id);
        if(data){
            let img = path.join(__dirname,'..',data.image);
            if(img){
                fs.unlinkSync(img);
            }
            let delet = await rec_img.findByIdAndDelete(req.params.id);
            if(delet){
               return res.redirect('/rec_img/rec_img_view');
            }

        }
    } catch (error) {
        console.log("rec_img delete :",error)
    }
}

module.exports.UpdateRecord = async (req,res)=>{
    try {
        let data = await rec_img.findById(req.params.id);
        if(data){
            res.render('rec_img_update',({data:data}))
        }
    } catch (error) {
        console.log("rec_img Update page error:",error);
    }
}
module.exports.EditRecord = async (req,res)=>{
    try {
        let id = req.body.editId;
        let data = await rec_img.findById(id);
        if(data){
            if(req.file){
                let imgpath = path.join(__dirname,'..',data.image);
                fs.unlinkSync(imgpath)

                let newimg = rec_img.avtharpath+"/"+req.file.filename;
                req.body.image = newimg

                req.body.updatedAt = nDate;

                let upadate = await rec_img.findByIdAndUpdate(id,req.body);
                return res.redirect('/rec_img/rec_img_view');

            }else{
                req.body.image = data.image;
                let nDate = new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Calcutta'
                });

                req.body.updatedAt = nDate;
                let upadate = await rec_img.findByIdAndUpdate(id,req.body);
                if(upadate){
                    return res.redirect('/rec_img/rec_img_view');
                }
            }
        }
    } catch (error) {
        console.log("rec_img EditRecord erroor",error);
    }
}

module.exports.mulDel = async (req,res)=>{
    try {
        let data = req.body.DeleteRecord;
        data.forEach(async element => {
            let id_data = await rec_img.findById(element);

            let img = path.join(__dirname,'..', id_data.image);
            fs.unlinkSync(img);

            await rec_img.findByIdAndUpdate(element);
        });
        return res.redirect('/rec_img/rec_img_view')
    } catch (error) {
        console.log("Multi Delete error",error);
    }
}