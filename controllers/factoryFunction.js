const asyncErrorHandler = require('../Utilities/asyncErrorHandler')
const customError = require('../Utilities/customError')
const Apifeatures = require('../Utilities/APIFeatures')

exports.deleteOne = (Model) =>
  asyncErrorHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
      return next(new customError('Document with that ID is not found', 404))
    }

    res.status(204).json({
      status: 'Success',
      message: 'The document is deleted',
    })
  })

exports.updateOne = (Model) =>
  asyncErrorHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!doc) {
      return next(new customError('Document with that ID is not found', 404))
    }

    res.status(200).json({
      status: 'Success',
      data: {
        doc,
      },
    })
  })

exports.createOne = (Model) =>
  asyncErrorHandler(async (req, res, next) => {
    const doc = await Model.create(req.body)

    //
    res.status(200).json({
      status: 'Success',
      data: {
        doc,
      },
    })
  })

exports.getOne = (Model, popOptions) =>
  asyncErrorHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id)

    if (popOptions) query = query.populate('reviews')

    const doc = await query

    if (!doc) {
      return next(new customError('Document with that ID is not found!!', 404))
    }

    res.status(200).json({
      status: 'Success',
      data: {
        doc,
      },
    })
  })

exports.getAll = (Model) =>
  asyncErrorHandler(async (req, res, next) => {
    let filter = {}

    if (req.params.movieId) filter = { movie: req.params.movieId }

    const features = new Apifeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination()

    let doc = await features.query

    res.status(200).json({
      status: 'Success',
      length: doc.length,
      data: {
        doc,
      },
    })
  })
