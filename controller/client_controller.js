const client = require('../model/client_model');
const path = require('path');
const fs = require('fs');
const express = require('express');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.Addclient = async (req, res) => {
    return res.render('client');

}
module.exports.insertRecornd = async (req, res) => {
    try {
        let imgpath = '';
        if (req.file) {
            imgpath = client.avtharpath + "/" + req.file.filename;
        }
        req.body.image = imgpath;

        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;

        let data = await client.create(req.body);
        if (data) {
            res.redirect('/client');
        }

    } catch (err) {
        console.log("insert client is err", err)
    }

}
module.exports.clientview = async (req, res) => {
    try {
        if (req.query.status == 'deActive') {
            await client.findByIdAndUpdate(req.query.id, { isActive: false })
        }
        if (req.query.status == 'Active') {
            await client.findByIdAndUpdate(req.query.id, { isActive: true })
        }
        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }

        let data_count = await client.find().countDocuments();
        let per_page = 2;
        let page_num = Math.ceil(data_count / per_page);

        let data = await client.find()
            .limit(per_page * 1)
            .skip((page - 1) * per_page)
            .exec();

        res.render('client_view', {
            clientData: data,
            cpage: page,
            page_num: page_num
        })

    } catch (err) {
        console.log('view page err in client :', err);
    }
}

module.exports.DeleteRecord = async (req, res)=>{
    try {
        let data = await client.findById(req.params.id);
        if(data){
            let img = path.join(__dirname,'..',data.image);
            if(img){
                fs.unlinkSync(img);
            }
            await client.findByIdAndDelete(req.params.id);
            return res.redirect('/client/client_view');
            

        }
    } catch (error) {
        console.log("client delete :",error)
    }
}

module.exports.UpdateRecord = async (req,res)=>{
    try {
        let data = await client.findById(req.params.id);
        if(data){
            res.render('client_update',({data:data}))
        }
    } catch (error) {
        console.log("client Update page error:",error);
    }
}
module.exports.EditRecord = async (req,res)=>{
    try {
        // let id = req.body.editId;
        let data = await client.findById(req.body.editId);
        if(data){
            if(req.file){
                let imgpath = path.join(__dirname,'..',data.image);
                fs.unlinkSync(imgpath)
                req.body.image = client.avtharpath+"/"+req.file.filename;
                req.body.updatedAt = nDate;

                 await Slider.findByIdAndUpdate(req.body.editId,req.body);
                return res.redirect('/client/client_view');
            }
        }
    } catch (error) {
        console.log("client EditRecord erroor",error);
    }
}

module.exports.mulDel = async (req,res)=>{
    try {
        let data = req.body.DeleteRecord;
        data.forEach(async element => {
            let id_data = await client.findById(element);

            let img = path.join(__dirname,'..', id_data.image);
            fs.unlinkSync(img);

            await client.findByIdAndUpdate(element);
        });
        return res.redirect('/client/client_view')
    } catch (error) {
        console.log("Multi Delete error",error);
    }
}