const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Staff = mongoose.model('Staff');

router.get('/', (req, res) => {
    res.render("staff/addOrEdit", {
        viewTitle: "Insert Staff"
    });
});



router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var staff = new Staff();
    staff.fullName = req.body.fullName;
    staff.email = req.body.email;
    staff.mobile = req.body.mobile;
    staff.department = req.body.department;
    staff.level = req.body.level;
    staff.location = req.body.location;
    staff.save((err, doc) => {
        if (!err)
            res.redirect('staff/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("staff/addOrEdit", {
                    viewTitle: "Insert Staff",
                    staff: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Staff.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('staff/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("staff/addOrEdit", {
                    viewTitle: 'Update Staff',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Staff.find((err, docs) => {
        if (!err) {
            res.render("staff/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving staff list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Staff.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("staff/addOrEdit", {
                viewTitle: "Update staff",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Staff.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/staff/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

module.exports = router;