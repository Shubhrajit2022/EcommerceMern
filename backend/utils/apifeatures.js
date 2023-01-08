class ApiFeatures {
    constructor(query,querystr){
        this.query =query
        this.querystr = querystr
        }

    search(){
        const keyword = this.querystr.keyword ? {
            name:{
                $regex : this.querystr.keyword,
                $options : "i",
            }

        }:{}
        // console.log(keyword);
        this.query = this.query.find({...keyword})
        return this;
    }
    filter(){
        const queryCopy = {...this.querystr} //to avoid error we take spread operator for referncing
        // console.log(queryCopy);
        //removing some fields for category
        const removeFields = ["keyword","page","limit"];

        removeFields.forEach(key=>delete queryCopy[key]);

        //filter for price and Rating
        // console.log(queryCopy);
        let querystr = JSON.stringify(queryCopy)
        querystr= querystr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`);

        // console.log(queryCopy);

        this.query = this.query.find(JSON.parse(querystr))
        // console.log(querystr);
        return this
    }
    async pagination(resultPerPage){
        // console.log(resultPerPage);
        const currentPage = Number(this.querystr.page || 1) 
        // console.log(currentPage);

        const skip = resultPerPage * (currentPage -1)
        // console.log(skip);
        this.query = this.query.limit(resultPerPage).skip(skip)
        // console.log(this.query);

        return this
    }
}
module.exports = ApiFeatures