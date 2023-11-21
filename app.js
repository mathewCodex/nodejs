const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const Blog = require('./models/blogSchema');
const { result } = require('lodash');
//express app
const app = express();
const db = `mongodb+srv://mathewCodex:for12345@cluster1.avjfq.mongodb.net/Node?retryWrites=true&w=majority`;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("listening  at 3000");
    app.listen(3000);
  });

app.set("view engine", "ejs");
app.use(morgan('dev'))

//static file
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))
app.use((req,res, next) => {
  console.log('host:', req.hostname);
  next();
})
app.use((req, res, next) => {
  console.log('morgan');
  next();
});
app.use((req, res, next) => {
 
  console.log( res.locals.path = req.path)
  next()
})


/////////testing db
app.get('/add-blogs', (req, res) => {
  const blog = new Blog({
    title: 'new blog 3',
    snippet: 'About new blog',
    body: 'More about new blog'
  })
  blog.save().then(result => {
    res.send(result)
  })
  .catch(err => {
    console.log(err)
  })
});

app.get('/all-blogs', (req,res) => {
  Blog.find().then(result => {
    res.send(result);
  }).catch(err => {
    console.log(err);
  })
});
app.get('/single-blog', (req, res) => {
  Blog.findById("655200ef3f23bb330a99d76f")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    }); 
})
////////////////==============//////////
app.get('/', (req, res) => {
  res.redirect('/blogs');
})


app.get('/about', (req, res) => {
  res.render('about', {title: 'about'})
})
app.get('/blog/create', (req, res) => {
  res.render('create', {title:' Create new blog'})
}); 
app.get('/blogs', (req, res) => {
  Blog.find().then(result => {
    res.render('index', { blogs: result, title: 'All blogs'})
  }).catch(err => {
    console.log(err)
  })
});
app.post("/blogs", (req, res) => {
  console.log(req.body);
  const blog = new Blog(req.body)
  blog.save().then(result => {
    res.redirect('/blogs')
  }).catch(err => {
    console.log(err);
  })
});

app.get('/blogs/:id', (req,res) => {
  const id = req.params.id;
  Blog.findById(id).then(result => {
    res.render('detail', {blog : result, title: 'Blog Detail'});
  }).catch(err => {
    console.log(err);
  });
})  

app.delete('/blogs/:id', (req,res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id).then(result => res.json({ redirect: '/blogs'})).catch(err => {
    console.log(err);
  })
})
//
app.use((req, res) => {
  res.status(404).render('404', {title: 'Page not found'});
})


