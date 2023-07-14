const subcategory = require('../model/subcategory_model');
const category = require('../model/category_model');
const path = require('path');
const fs = require('fs');
const express = require('express');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

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
module.exports.Addsubcategory = async (req, res) => {
    let category_data = await category.find({isActive: true});
    return res.render('subcategory',({category : category_data}));

}
module.exports.insertRecornd = async (req, res) => {
    try {
        let imgpath = '';
        if (req.file) {
            imgpath = subcategory.avtharpath + "/" + req.file.filename;
        }
        req.body.image = imgpath;

        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        let anyDate = new Date();
        req.body.date = anyDate.toShortFormat(); 

        let data = await subcategory.create(req.body);
        if (data) {
            res.redirect('/subcategory');
        }
    } catch (err) {
        console.log("Add subcategory is err", err)
    }

}
module.exports.subcategoryview = async (req, res) => {
    try {
        if (req.query.status == 'deActive') {
            let deActive = await subcategory.findByIdAndUpdate(req.query.id, { isActive: false })
        }
        if (req.query.status == 'Active') {
            let Active = await subcategory.findByIdAndUpdate(req.query.id, { isActive: true })
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


        let data_count = await subcategory.find({}).countDocuments;
        let page_Num = Math.ceil(data_count / per_page);

        let data = await subcategory.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { date: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).populate('category_id')
            .limit(per_page * 1)
            .skip((page - 1) * per_page)
            .exec();

        if (data) {
            res.render('subcategory_view', ({
                subcategorydata: data,
                cpage: page,
                page_Num: page_Num,
                search: search
            }));
        }
    } catch (err) {
        console.log("subcategory_view err in subcategory : ", err);
    }
}
module.exports.DeleteRecord = async (req, res)=>{
    try {
        let data = await subcategory.findById(req.params.id);
        if(data){
            let img = path.join(__dirname,'..',data.image);
            if(img){
                fs.unlinkSync(img);
            }
            let delet = await subcategory.findByIdAndDelete(req.params.id);
            if(delet){
               return res.redirect('/subcategory/subcategory_view');
            }

        }
    } catch (error) {
        console.log("subcategory delete :",error)
    }
}

module.exports.UpdateRecord = async (req,res)=>{
    try {
        let data = await subcategory.findById(req.params.id);
        let category_data = await category.find({});
        if(data){
            res.render('subcategory_update',({data:data , category: category_data}))
        }
    } catch (error) {
        console.log("subcategory Update page error:",error);
    }
}
module.exports.EditRecord = async (req,res)=>{
    try {
        let id = req.body.editId;
        let data = await subcategory.findById(id);
        if(data){
            if(req.file){
                let imgpath = path.join(__dirname,'..',data.image);
                fs.unlinkSync(imgpath)

                let newimg = subcategory.avtharpath+"/"+req.file.filename;
                req.body.image = newimg

                req.body.updatedAt = nDate;

                let upadate = await subcategory.findByIdAndUpdate(id,req.body);
                return res.redirect('/subcategory/subcategory_view');

            }else{
                req.body.image = data.image;
                let nDate = new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Calcutta'
                });

                req.body.updatedAt = nDate;
                let upadate = await subcategory.findByIdAndUpdate(id,req.body);
                if(upadate){
                    return res.redirect('/subcategory/subcategory_view');
                }
            }
        }
    } catch (error) {
        console.log("subcategory EditRecord erroor",error);
    }
}

module.exports.mulDel = async (req,res)=>{
    try {
        let data = req.body.DeleteRecord;
        data.forEach(async element => {
            let id_data = await subcategory.findById(element);

            let img = path.join(__dirname,'..', id_data.image);
            fs.unlinkSync(img);

            await subcategory.findByIdAndUpdate(element);
        });
        return res.redirect('/subcategory/subcategory_view')
    } catch (error) {
        console.log("Multi Delete error",error);
    }
}