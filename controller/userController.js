const Slider = require('../model/slider_model');
const offer = require('../model/offer_model');
const rec_img = require('../model/rec_img_model');
const say = require('../model/say_model');
const blog = require('../model/blog_model');
const comment = require('../model/comment_model');
const category = require('../model/category_model');
const subcategory = require('../model/subcategory_model');
const team = require('../model/team_model');
const client = require('../model/client_model');
const nodemailer = require('nodemailer');


module.exports.index = async (req, res) => {
    try {
        let slider_data = await Slider.find({isActive: true})
        let offer_data = await offer.find({isActive:true})
        let rec_img_data = await rec_img.find({isActive:true})
        let say_data = await say.find({isActive:true})
        let Blogdata = await blog.find({isActive:true})


        if (offer_data) {
            res.render('user/user_index', {
                Slider: slider_data,
                offer:offer_data,
                rec_img:rec_img_data,
                say:say_data,
                blog:Blogdata,
            })
        }
    }catch (err) {
        console.log('user data send err in index', err)
    }
};
module.exports.blogsingle = async (req,res)=>{
    try {

        let id = req.query.id;
    
        let comments = await comment.find({ post_id: id, isActive: true });
        let comment_count = await comment.find({ post_id: req.query.id, isActive: true }).countDocuments();
    
        var latest = await blog.find({isActive:true}).sort({_id:-1}).limit(3);
    
        // next previous
        var blogs_array = await blog.find({});
        var blogs_ids = [];
        blogs_array.forEach(element => {
          blogs_ids.push(element.id);
        });
        let next = '';
        for (var i = 0; i < blogs_array.length; i++) {
          if (blogs_array[i] == id) {
            next = i;
          }
        }
    
        next = blogs_ids.indexOf(id);
    
        // ----end next previous -----

         //resent blog
    var latest = await blog.find({ isActive: true }).sort({ _id: -1 }).limit(3);

    //gallary
    var gallary = await blog.find({ isActive: true }).sort({ _id: -1 }).limit(6);
    
        var blogs = await blog.findById(id);
    
        res.render('user/blog_single', ({
          resent: latest,
          blog: blogs,
          comment_count:comment_count,
          comment: comments,
          next: next,
          pre: next,
          blogs_ids: blogs_ids,
          gallary : gallary,
        }))
    
      } catch (error) {
        console.log("blog_singel  err ", error);
      }
}


module.exports.gallery = async (req, res) => {
  try {
    let cat_data = await category.find({ isActive: true });
    let subcat_data = await subcategory.find({ isActive: true });

    return res.render('user/gallery', ({ cat: cat_data, subcat: subcat_data }));

  } catch (error) {
    console.log("gallery page error in user : ", error);
  }
}


module.exports.service = async (req, res) => {
  try {
    let data = await offer.find({ isActive: true });

    res.render('user/services', ({ data }));
  } catch (err) {
    console.log('user services', err);
  }
}



module.exports.blog1 = async (req, res) => {
  try {

    let search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    let page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    let per_page = 6;

    let count = await blog.find({
      isActive: true,
      $or: [
        { title: { $regex: '.*' + search + '.*', $options: 'i' } },
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { date: { $regex: '.*' + search + '.*', $options: 'i' } },
        { Content: { $regex: '.*' + search + '.*', $options: 'i' } },
        { category: { $regex: '.*' + search + '.*', $options: 'i' } },
      ]
    }).countDocuments();

    let t_page = Math.ceil(count / per_page);

    let blog2 = await blog.find({
      isActive: true,
      $or: [
        { title: { $regex: '.*' + search + '.*', $options: 'i' } },
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { date: { $regex: '.*' + search + '.*', $options: 'i' } },
        { Content: { $regex: '.*' + search + '.*', $options: 'i' } },
        { category: { $regex: '.*' + search + '.*', $options: 'i' } },
      ]
    }).limit(per_page * 1)
      .skip((page - 1) * per_page)
      .exec();

    res.render('user/blog', ({
      blog: blog2,
      page_num: t_page,
      cpage: page,
      search: search
    }))
  } catch (err) {
    console.log('user services', err);
  }
}

module.exports.about = async (req, res) => {
  try {
    let say1 = await say.find({ isActive: true });
    let team1 = await team.find({ isActive: true });
    let client_data = await client.find({ isActive: true });

    res.render('user/about', ({
      say: say1,
      team: team1,
      client_data: client_data
    }))
  } catch (err) {
    console.log('user services', err);
  }
}

module.exports.contact = async (req, res) => {
  try {
    res.render('user/contact')
  } catch (err) {
    console.log('user services', err);
  }
}


module.exports.contact_mail = async (req, res) => {
  try {
        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "ea19293856fa8c",
                pass: "268d734f50c217"
            }
        });
        let info = await transporter.sendMail({
            from: 'kusumakarrnw@gmial.com', // sender address
            to: req.body.email, // list of receivers
            subject: req.body.subject, // Subject line
            text: req.body.message, // plain text body
        });
        res.redirect('/user/contact');
    
} catch (err) {
    console.log('', err);
}
}