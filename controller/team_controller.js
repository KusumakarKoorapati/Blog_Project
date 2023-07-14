const team = require('../model/team_model');
const path = require('path');
const fs = require('fs');
const express = require('express');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.Addteam = async (req, res) => {
    return res.render('team');

}
module.exports.insertRecornd = async (req, res) => {
    try {
        let imgpath = '';
        if (req.file) {
            imgpath = team.avtharpath + "/" + req.file.filename;
        }
        req.body.image = imgpath;

        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;

        let data = await team.create(req.body);
        if (data) {
            res.redirect('back');
        }
    } catch (err) {
        console.log("Add team is err", err)
    }

}
module.exports.teamview = async (req, res) => {
    try {
        if (req.query.status == 'deActive') {
            await team.findByIdAndUpdate(req.query.id, { isActive: false });
        }
        if (req.query.status == 'Active') {
            await team.findByIdAndUpdate(req.query.id, { isActive: true });
        }

        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }

        let data_count = await team.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { about: { $regex: '.*' + search + '.*', $options: 'i' } },
                { post: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();

        let per_page = 2;
        let page_num = Math.ceil(data_count / per_page);

        let data = await team.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { about: { $regex: '.*' + search + '.*', $options: 'i' } },
                { post: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit(per_page * 1)
            .skip((page - 1) * per_page)
            .exec();
        res.render('team_view', ({
            teamData: data,
            search: search,
            pageNum: page_num,
            cpage: page,
        }))
    } catch (err) {
        console.log('view-page err in team : ', err);
    }
}

module.exports.DeleteRecord = async (req, res)=>{
    try {
        let data = await team.findById(req.params.id);
        if(data){
            let img = path.join(__dirname,'..',data.image);
            if(img){
                fs.unlinkSync(img);
            }
            let delet = await team.findByIdAndDelete(req.params.id);
            if(delet){
               return res.redirect('/team/team_view');
            }

        }
    } catch (error) {
        console.log("team delete :",error)
    }
}

module.exports.UpdateRecord = async (req,res)=>{
    try {
        let data = await team.findById(req.params.id);
        if(data){
            res.render('team_update',({data:data}))
        }
    } catch (error) {
        console.log("team Update page error:",error);
    }
}
module.exports.EditRecord = async (req,res)=>{
    try {
        let id = req.body.editId;
        let data = await team.findById(id);
        if(data){
            if(req.file){
                let imgpath = path.join(__dirname,'..',data.image);
                fs.unlinkSync(imgpath)

                let newimg = team.avtharpath+"/"+req.file.filename;
                req.body.image = newimg

                req.body.updatedAt = nDate;

                let upadate = await team.findByIdAndUpdate(id,req.body);
                return res.redirect('/team/team_view');

            }else{
                req.body.image = data.image;
                let nDate = new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Calcutta'
                });

                req.body.updatedAt = nDate;
                let upadate = await team.findByIdAndUpdate(id,req.body);
                if(upadate){
                    return res.redirect('/team/team_view');
                }
            }
        }
    } catch (error) {
        console.log("team EditRecord erroor",error);
    }
}

module.exports.mulDel = async (req,res)=>{
    try {
        let data = req.body.DeleteRecord;
        data.forEach(async element => {
            let id_data = await team.findById(element);

            let img = path.join(__dirname,'..', id_data.image);
            fs.unlinkSync(img);

            await team.findByIdAndUpdate(element);
        });
        return res.redirect('/team/team_view')
    } catch (error) {
        console.log("Multi Delete error",error);
    }
}