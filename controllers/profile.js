const User = require("../models/user");
const Champions = require('../models/champions');


exports.getMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user);
        if (req.session.isLoggedIn) {
            return res.status(200).render('user/profile.ejs', {
                pageTitle: 'My Profile',
                path: '/profile',
                rank: user.rank,
                highscore: user.highscore.wpm,
                username: user.nickname,
                words: user.highscore.words,
            })
        }
        return res.status(401).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            oldInput: { email: '', password: '' }
        });
    } catch (error) {
        error.httpStatusCode = 500;
        return next(error);
    }
};


exports.getFame = async (req, res, next) => {
    let place = req.query.place || 1;
    
    try {
        const champ = await Champions.findOne({ place: place });
        const user = await User.findById(champ.userId);

        return res.status(200).render('user/hallOfFame', {
            pageTitle: 'Login',
            path: '/login',
            champ: user,
            place: place
        });
    } catch (error) {
        error.httpStatusCode = 500;
        return next(error);
    }
};