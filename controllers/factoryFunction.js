const asyncErrorHandler = require('../Utilities/asyncErrorHandler')
const customError = require('../Utilities/customError')

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
