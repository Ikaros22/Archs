const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
    res.status(200).render('auth/login', {
        pageTitle: 'Login',
        errorMessage: '',
        oldInput: { email: '', password: '' },
    });
}

exports.getSignup = (req, res, next) => {
    res.status(200).render('auth/getStarted', {
        pageTitle: 'Signup',
        errorMessage:'',
        oldInput: { email: '', password: '', username: '' },
    });
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        return res.status(400).render('auth/login', {
            pageTitle: 'Login',
            oldInput: { email: '', password: '' },
            isAuthenticated: false
        });
    });
};

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).render('auth/login', {
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, password: password },
        });
    };

    try {
        const user = await User.findOne({ email: email });

        if (!user || !bcrypt.compare(password, user.password)) {
            return res.status(401).render('auth/login', {
                pageTitle: 'Login',
                path: '/login',
                errorMessage: "Enter correct email and password!",
                oldInput: { email: email, password: password },
            });
        }

        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(result => {
            res.redirect('/profile');
        });
    } catch (error) {
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postSignup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const nickname = req.body.nickname;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).render('auth/getStarted', {
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, password: password, nickname: nickname }
        });
    };

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email: email, password: hashedPassword, nickname: nickname, highscore: { wpm: 0, cpm: 0, mistakes: 0, words: 0 }, rank: "Private" });
        await user.save();

        res.redirect('/login');
    } catch (err) {
        err.httpStatusCode = 500;
        return next(error);
    };
}