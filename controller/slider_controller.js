const Slider = require('../model/slider_model');
const path = require('path');
const fs = require('fs');
const express = require('express');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.Addslider = async (req, res) => {
    return res.render('slider');

}
module.exports.insertRecornd = async (req, res) => {
    try {
        let imgpath = '';
        if (req.file) {
            imgpath = Slider.avtharpath + "/" + req.file.filename;
        }
        req.body.image = imgpath;

        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;

        let data = await Slider.create(req.body);
        if (data) {
            res.redirect('/slider');
        }
    } catch (err) {
        console.log("Add slider is err", err)
    }

}
module.exports.sliderview = async (req, res) => {
    try {
        if (req.query.status == 'deActive') {
            let Active = await Slider.findByIdAndUpdate(req.query.id, { isActive: false })
        }
        if (req.query.status == 'Active') {
            let Active = await Slider.findByIdAndUpdate(req.query.id, { isActive: true })
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


        let data = await Slider.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }

            ]
        }).limit(per_page * 1)
            .skip((page - 1) * per_page)
            .exec();


        let data_count = await Slider.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }

            ]
        }).countDocuments();

        let pageNum = Math.ceil(data_count / per_page)

        if (data) {
            res.render('slider_view', ({
                sliderData: data,
                pageNum: pageNum,
                cpage: page,
                search: search
            }))
        }
    } catch (error) {
        console.log("Slider view page is error:",error)
    }
}

module.exports.DeleteRecord = async (req, res)=>{
    try {
        let data = await Slider.findById(req.params.id);
        if(data){
            let img = path.join(__dirname,'..',data.image);
            if(img){
                fs.unlinkSync(img);
            }
            let delet = await Slider.findByIdAndDelete(req.params.id);
            if(delet){
               return res.redirect('/slider/slider_view');
            }

        }
    } catch (error) {
        console.log("Slider delete :",error)
    }
}

module.exports.UpdateRecord = async (req,res)=>{
    try {
        let data = await Slider.findById(req.params.id);
        if(data){
            res.render('slider_update',({data:data}))
        }
    } catch (error) {
        console.log("Slider Update page error:",error);
    }
}
module.exports.EditRecord = async (req,res)=>{
    try {
        let id = req.body.editId;
        let data = await Slider.findById(id);
        if(data){
            if(req.file){
                let imgpath = path.join(__dirname,'..',data.image);
                fs.unlinkSync(imgpath)

                let newimg = Slider.avtharpath+"/"+req.file.filename;
                req.body.image = newimg

                req.body.updatedAt = nDate;

                let upadate = await Slider.findByIdAndUpdate(id,req.body);
                return res.redirect('/slider/slider_view');

            }else{
                req.body.image = data.image;
                let nDate = new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Calcutta'
                });

                req.body.updatedAt = nDate;
                let upadate = await Slider.findByIdAndUpdate(id,req.body);
                if(upadate){
                    return res.redirect('/slider/slider_view');
                }
            }
        }
    } catch (error) {
        console.log("Slider EditRecord erroor",error);
    }
}

module.exports.mulDel = async (req,res)=>{
    try {
        let data = req.body.DeleteRecord;
        data.forEach(async element => {
            let id_data = await Slider.findById(element);

            let img = path.join(__dirname,'..', id_data.image);
            fs.unlinkSync(img);

            await Slider.findByIdAndUpdate(element);
        });
        return res.redirect('/slider/silder_view')
    } catch (error) {
        console.log("Multi Delete error",error);
    }
}