class Apifeatures {
  constructor(query, queryStr) {
    this.query = query
    this.queryStr = queryStr
  }

  filter() {
    const queryCopy = { ...this.queryStr }

    // Removing fields from the query
    const removeFields = ['sort', 'fields', 'limit', 'page']
    removeFields.forEach((el) => delete queryCopy[el])

    // Advance filter using: lt, lte, gt, gte
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )

    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  sort() {
    this.queryStr.sort
      ? this.query.sort(this.queryStr.sort.split(',').join(' '))
      : this.query.sort('-name')

    return this
  }

  limitFields() {
    this.queryStr.fields
      ? this.query.select(this.queryStr.fields.split(',').join(' '))
      : this.query.select('-__v')

    return this
  }

  pagination() {
    const page = +this.queryStr.page || 1
    const limit = +this.queryStr.limit || this.query
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)

    // if (this.queryStr.page) {
    //   const moviesCount = await Movie.countDocuments()
    //   if (skip >= moviesCount)
    //     throw new Error(' There are no records to display!!')
    // }

    return this
  }
}

module.exports = Apifeatures
