const express = require('express');
const say = require('../model/say_model')
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.Addsay =async (req, res) => {
    return res.render('say');
}
module.exports.insertRecornd = async (req, res) => {
    try {
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        let data = await say.create(req.body);
        if (data) {
            return res.redirect('/say');
        }
    } catch (error) {
        console.log("say insert record error : ", error);
    }
}
module.exports.sayview = async (req,res)=>{
    
    try { 
        if (req.query.status == 'deActive') {
            let Active = await say.findByIdAndUpdate(req.query.id, { isActive: false });
        }

        if (req.query.status == 'Active') {
            let Active = await say.findByIdAndUpdate(req.query.id, { isActive: true });
        }
        var search='';
        if(req.query.search){
            search=req.query.search;
        }

        let data_count = await say.find({}).countDocuments();

        let per_page=2;
        let page=1;
        if(req.query.page){
            page=req.query.page;
        }

        var page_num=Math.ceil(data_count/per_page);

        let data = await say.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit((per_page)*1)
        .skip((page-1)*per_page)
        .exec();

        if (data) {
            res.render('say_view', ({ 
                saydata: data ,
                page_num: page_num,
                cpage: page,
                search: search
            }));
        }
    } catch (error) {
        console.log("say error : ", error);
    }
}
module.exports.DeleteRecord = async (req,res)=>{
    try {
        let delet = await say.findByIdAndDelete(req.params.id);
        if (delet) {
            res.redirect('/say/say_view')
        }
    } catch (error) {
        console.log("say delete", error);
    }
}
module.exports.UpdateRecord = async(req,res)=>{
    try {
        let data = await say.findById(req.params.id);
        if (data) {
            res.render('say_update', ({ data: data }))
        }
    } catch (error) {
        console.log("say update page error:",error);
    }
}
module.exports.EditRecord = async(req,res)=>{
    try {
        req.body.updatedAt = nDate;
        let id = req.body.editId;
        let update = await say.findByIdAndUpdate(id,req.body);
        if(update) {
            res.redirect('/say/say_view');
        }
    } catch (error) {
        console.log("say Edit", error);
    }
}
module.exports.mulDel = async (req,res)=>{
    try {

        data = req.body.mulDel;
        data.forEach(async element => {
            await say.findByIdAndDelete(element);
        });
        res.redirect('/say/say_view')

    } catch (error) {
        console.log('say multi delete err ');
    }
}