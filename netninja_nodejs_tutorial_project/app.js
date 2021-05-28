const { render } = require('ejs');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Blog = require('./models/blog');


// register view engine
app.set('view engine','ejs');

app.listen(3000);

// connect mongoDb

const db = 'mongodb+srv://molla:molla@cluster0.a9vnn.mongodb.net/note-tuts?retryWrites=true&w=majority';
mongoose.connect(db,{ useNewUrlParser: true,useUnifiedTopology: true })
.then((result)=> console.log('connected to db'))
.catch((err)=>console.log(err));


// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res) =>{

    res.redirect('/blogs');
});

app.get('/blogs',(req,res)=>{

    Blog.find().sort({createdAt:-1})
    .then(result =>{
        res.render('index',{title:'all-blogs',blogs:result})
    })
    .catch(err =>{
        console.log(err);
    });
    
})
app.post('/blogs',(req,res)=>{

    const blog = new Blog(req.body);
    blog.save()
    .then(result =>{
        res.redirect('/blogs')
    })
    .catch(err =>{
        console.log(err);
    });

})
app.get('/blogs/:id',(req,res)=>{
    const id = req.params.id;
    Blog.findById(id)
    .then(result =>{
        res.render('details',{blog:result,title:'Blog Details'})
    })
    .catch(err =>{
        console.log(err); 
    });

})
app.delete('/blogs/:id',(req,res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result =>{
        res.json({redirect:'/blogs'});
    })
    .catch(err =>{
        console.log(err)
    })
})
app.get('/about',(req,res) =>{
    res.render('about',{title:'about'});
});

app.get('/about-us',(req,res) =>{
    res.redirect('/about',{title:'about'});
})

app.get('/blogs/create',(req,res) =>{
    res.render('create',{title:'create a new blog'});
})

app.use((req,res) =>{
    res.status(404).render('404',{title:'404'});
})

