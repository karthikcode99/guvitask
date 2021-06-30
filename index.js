require('dotenv').config();
const express=require('express');
const app=express()
const mongoose = require('mongoose');
const path = require('path');
const User =require('./models/user');
const session = require('express-session');
const Prop=require('./models/prop')
const flash = require('connect-flash');
const mate=require('ejs-mate')
const passport = require('passport');
const LocalStrategy = require('passport-local');
app.engine('ejs', mate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
const {isLoggedIn}=require('./middleware')
app.use(express.urlencoded({ extended: true }));
const kar=process.env.DB_URL
mongoose.connect(kar, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
    const sessionConfig = {
        secret: 'thisshouldbeabettersecret!',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }
    
 app.use(session(sessionConfig))
 app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})   
app.get('/', (req,res)=>{
    res.render('sample');
})
 app.get('/Alldetails', isLoggedIn ,(req, res)=>{
     res.render('index')
  })  
app.post('/Alldetails', isLoggedIn ,async(req,res)=>{
    try{
    const {name, gender, dob, mobile, age}=req.body;
    const remind=new Prop({ name, gender, dob, mobile, age })
    await remind.save()
    console.log(remind)
    }
    catch (e) {
        console.log('error', e);
       res.redirect('/profile');
    }
})
app.get('/profile', isLoggedIn, async(req,res)=>{
    const propty=await Prop.find({})
    res.render('dete',{propty})
})

  app.get('/register',(req, res)=>{
  res.render('register');
});
app.post('/register' ,async(req, res) =>{
    const { username, email, password, confirm}= req.body;
    if(password==confirm){
     try{
         const user=new User({email, username})
const registeredUser=await User.register(user, password);
 await registeredUser.save()
     }
        catch (e) {
        console.log('error', e);
        res.redirect('/login');
    }
}
else{
req.flash('error',"password and confrim password should be same");
res.redirect('/register')
}
});
app.get('/login', (req, res)=>{
res.render('login')
})
app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res)=> {
    req.flash('success', 'welcome back');
    res.redirect('/Alldetails')
})
app.get('/logout', (req, res)=> {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})
const port=process.env.PORT|| 3000;
app.listen(port, () => {
    console.log("Serving on port")
})
