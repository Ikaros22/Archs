const Text = require('../models/text');
const User = require('../models/user');
const Champions = require('../models/champions');

exports.getGo = async (req, res, next) => {
    const id = Math.floor((Math.random() * 4) + 1);

    try {
        req.session.text = await Text.findOne({ id: id });
        slicedText = req.session.text.text.split(' ');
        req.session.saved = false;

        res.status(200).render('go', {
            path: '/',
            pageTitle: 'Go!',
            errorMessage: "",
            text: slicedText
        })
    } catch (error) {
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.postResult = async (req, res, next) => {
    const userText = req.body.userText.split(' ');
    const words = userText.length - 1;
    const userTextSliced = req.body.userText.split('');
    const slicedText = req.session.text.text.split('');
    let mistakes = 0;

    if (!req.session.saved && req.session.isLoggedIn) {
        let lastCorrect = true;
        for (let j = 0; j < userTextSliced.length; j++) {
            if (userTextSliced[j] !== slicedText[j]) {
                if (lastCorrect) {
                    mistakes++;
                    lastCorrect = false;
                }
            } else {
                lastCorrect = true;
            }
        }

        const CPM = Number(userTextSliced.length * 60 / 45).toFixed(2);
        const WPM = Number(words * 60 / 45).toFixed(2);
        try {
            const user = await User.findOne({ _id: req.user._id });

            let record;

            if (WPM > user.highscore.wpm) {
                user.highscore.wpm = WPM;
                user.highscore.cpm = CPM;
                user.highscore.mistakes = mistakes;
                record = true;
            }

            user.highscore.words += words;

            await user.save();

            for (j = 1; j < 4; j++) {
                let id = await Champions.findOne({ place: j })
                let champ = await User.findById(id.userId);
                if (WPM > champ.highscore.wpm) {
                    id.userId = user._id;
                    await id.save();
                    break;
                }
            }

            res.status(200).render('user/result', {
                path: '/result',
                pageTitle: 'Great work!',
                mistakes: mistakes,
                words: words,
                WPM: WPM,
                CPM: CPM,
                highWPM: user.highscore.wpm,
                highMSTK: user.highscore.mistakes,
                highCPM: user.highscore.cpm,
                record: record,
            })

            req.session.saved = true;
        } catch (error) {
            error.httpStatusCode = 500;
            return next(error);
        }
    } else {
        res.status(401).render('auth/login', {
            pageTitle: 'Login',
            oldInput: { email: '', password: '' },
            isAuthenticated: false
        });
    }
}