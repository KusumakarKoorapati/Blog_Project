const express = require('express');
const offer = require('../model//offer_model')
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.Addoffer =async (req, res) => {
    return res.render('offer');
}
module.exports.insertRecornd = async (req, res) => {
    try {
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        let data = await offer.create(req.body);
        if (data) {
            return res.redirect('/offer');
        }
    } catch (error) {
        console.log("offer insert record error : ", error);
    }
}
module.exports.offerview = async (req,res)=>{
    
    try { 
        if (req.query.status == 'deActive') {
            let Active = await offer.findByIdAndUpdate(req.query.id, { isActive: false });
        }

        if (req.query.status == 'Active') {
            let Active = await offer.findByIdAndUpdate(req.query.id, { isActive: true });
        }
        var search='';
        if(req.query.search){
            search=req.query.search;
        }

        let data_count = await offer.find({}).countDocuments();

        let per_page=2;
        let page=1;
        if(req.query.page){
            page=req.query.page;
        }

        var page_num=Math.ceil(data_count/per_page);

        let data = await offer.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit((per_page)*1)
        .skip((page-1)*per_page)
        .exec();



        if (data) {
            res.render('offer_view', ({ 
                offerdata: data ,
                page_num: page_num,
                cpage: page,
                search: search
            }));
        }
    } catch (error) {
        console.log("offer error : ", error);
    }
}
module.exports.DeleteRecord = async (req,res)=>{
    try {
        let delet = await offer.findByIdAndDelete(req.params.id);
        if (delet) {
            res.redirect('/offer/offer_view')
        }
    } catch (error) {
        console.log("offer delete", error);
    }
}
module.exports.UpdateRecord = async(req,res)=>{
    try {
        let data = await offer.findById(req.params.id);
        if (data) {
            res.render('offer_update', ({ data: data }))
        }
    } catch (error) {
        console.log("offer update page error:",error);
    }
}
module.exports.EditRecord = async(req,res)=>{
    try {
        req.body.updatedAt = nDate;
        let id = req.body.editId;
        let update = await offer.findByIdAndUpdate(id,req.body);
        if (update) {
            res.redirect('/offer/offer_view');
        }
    } catch (error) {
        console.log("offer Edit", error);
    }
}
module.exports.mulDel = async (req,res)=>{
    try {

        data = req.body.mulDel;
        data.forEach(async element => {
            await offer.findByIdAndDelete(element);
        });
        res.redirect('/offer/offer_view')

    } catch (error) {
        console.log('offer multi delete err ');
    }
}