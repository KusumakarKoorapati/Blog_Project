const category = require('../model/category_model')
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.Addcategory =async (req, res) => {
    return res.render('category');
}
module.exports.insertRecornd = async (req, res) => {
    try {
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        console.log(req.body)
        let data = await category.create(req.body);
        if(data){
            return res.redirect('/category');
        }
        // let data = await category.create(req.body);
        // if (data) {
        //     return res.redirect('back');
        // }
    } catch (error) {
        console.log("category insert record error : ", error);
    }
}
module.exports.categoryview = async (req,res)=>{
    
    try { 
        if (req.query.status == 'deActive') {
            let Active = await category.findByIdAndUpdate(req.query.id, { isActive: false });
        }

        if (req.query.status == 'Active') {
            let Active = await category.findByIdAndUpdate(req.query.id, { isActive: true });
        }
        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }

        let par_page = 2;

        let data_count = await category.find({
            $or: [
                { category: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();

        let page_no = Math.ceil(data_count / par_page);

        let data = await category.find({
            $or: [
                { category: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit(par_page * 1)
            .skip((page - 1) * par_page)
            .exec();


        if (data) {
            res.render('category_view',
                ({
                    categorydata: data,
                    cpage: page,
                    page_num: page_no,
                    search: search,

                })
            );
        }
    } catch (error) {
        console.log("category error : ", error);
    }
}
module.exports.DeleteRecord = async (req,res)=>{
    try {
        let delet = await category.findByIdAndDelete(req.params.id);
        if (delet) {
            res.redirect('/category/category_view')
        }
    } catch (error) {
        console.log("category delete", error);
    }
}
module.exports.UpdateRecord = async(req,res)=>{
    try {
        let data = await category.findById(req.params.id);
        if (data) {
            res.render('category_update', ({ data: data }))
        }
    } catch (error) {
        console.log("category update page error:",error);
    }
}
module.exports.EditRecord = async(req,res)=>{
    try {
        req.body.updatedAt = nDate;
        let id = req.body.editId;
        let update = await category.findByIdAndUpdate(id,req.body);
        if (update) {
            res.redirect('/category/category_view');
        }
    } catch (error) {
        console.log("category Edit", error);
    }
}
module.exports.mulDel = async (req,res)=>{
    try {

        data = req.body.mulDel;
        data.forEach(async element => {
            await category.findByIdAndDelete(element);
        });
        res.redirect('/category/category_view')

    } catch (error) {
        console.log('category multi delete err ');
    }
}