const Course = require('../models/Course')
const { mongooseToObject } = require('../../util/mongoose')

class CourseController {
    
    // [GET] /courses/:slugs
    async show(req, res, next) {
        try {
            res.render('courses/show', {
                course: mongooseToObject(await Course.findOne({slug: req.params.slug}))
            });
        } catch (error) {
            next(error)
            console.error(error);
        }
    }

    // [GET] /courses/create
    async create(req, res, next) {
        try {
            res.render('courses/create')
        } catch (error) {
            next(error)
            console.error(error);
        }
    }

    // [POST] /courses/store
    async store(req, res, next) {
        try {
            
            const course = await new Course(req.body)
            course.save()
            // res.json({message: "Add course successfull!", course})
            res.redirect('/courses/create');
        } catch (error) {
            next(error)
            console.error(error);
        }
    }

    // [GET] /courses/:id/edit
    async edit(req, res, next) {
        try {
            res.render('courses/edit', {
                course: mongooseToObject(await Course.findById(req.params.id))
            })
        } catch (error) {
            next()
            console.error(error);
        }
    }

    // [PUT] /courses/:id
    async update(req, res, next) {
        try {
            await Course.findByIdAndUpdate(req.params.id ,req.body)
            res.redirect('/me/stored/courses');
        } catch (error) {
            next()
            console.error(error);
        }
    }

    // [DELETE soft] /courses/:id
    async delete(req, res, next) {
        try {
            await Course.delete({_id: req.params.id})
            res.redirect('/me/stored/courses')
        } catch (error) {
            next()
            console.error(error);
        }
    }

    // [PATCH] /courses/:id/restore
    async restore(req, res, next) {
        try {
            await Course.restore({_id: req.params.id})
            res.redirect('/me/trash/courses')
        } catch (error) {
            next()
            console.error(error);
        }
    }

    // [DELETE force] /courses/:id/fpce
    async forceDelete(req, res, next) {
        try {
            await Course.findByIdAndDelete({_id: req.params.id})
            res.redirect('/me/trash/courses');
        } catch (error) {
            next()
            console.error(error);
        }
    }

    // [POST] /courses/handle-form-actions
    async handleFormActions(req, res, next) {
        try {
            switch(req.body.action) {
                case 'delete':
                    try {
                        await Course.delete({_id: { $in: req.body.courseIds }})
                        res.redirect('/me/stored/courses')
                    } catch (error) {
                        next()
                        console.error(error);
                    }
                    break;
                
                case'restore':
                    try {
                        await Course.restore({_id: { $in: req.body.courseIds }})
                        res.redirect('/me/trash/courses')
                    } catch (error) {
                        next()
                        console.error(error);
                    }
                    break;

                case 'remove':
                    try {
                        await Course.deleteMany({_id: { $in: req.body.courseIds }})
                        res.redirect('/me/trash/courses');
                    } catch (error) {
                        next()
                        console.error(error);
                    }
                    break;
                default:
                    res.json('no action')
            }
            
        } catch (error) {
            next()
            console.error(error);
        }
    }
    
}

module.exports = new CourseController();
