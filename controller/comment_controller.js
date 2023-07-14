const comment = require('../model/comment_model');
const mongoose = require('mongoose');
const path = require('path')
const fs = require('fs');
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

module.exports.insertcomment = async (req, res) => {
    try {
        let i = ' ';
        if (req.file) {
            i = comment.avtharpath+ "/" +req.file.filename;
        }

        let anyDate = new Date;
        req.body.date = anyDate.toShortFormat();
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        req.body.image = i;

        let data = await comment.create(req.body);

        if (data) {
            return res.redirect('back');
        }
    } catch (error) {
        console.log("comment enter err in insertcommentt ", error);
    }
}

module.exports.DeleteRecord = async (req, res) => {
    let data = await comment.findById(req.params.id);
    if (data) {
        let i = path.join(__dirname, '..', data.image);
        fs.unlinkSync(i);

        let delet = await comment.findByIdAndDelete(req.params.id);
        if (delet) {
            return res.redirect('/blog/view_comment')
        }

    }
}

module.exports.mulDel = async (req, res) => {
    try {
        let ids=req.body.mulDel;
        ids.forEach(async element => {
            let data=await comment.findById(element);
            if(data){
                let i=path.join(__dirname,'..',data.image);
                fs.unlinkSync(i);

                await comment.findByIdAndDelete(element);
            }
        });
        res.redirect('back');
    } catch (err) {
        console.log('multi delate err in comment : ', err);
    }
}