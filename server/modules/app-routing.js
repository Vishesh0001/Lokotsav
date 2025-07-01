class routing{
    v1(app){
        const parent_routes=require('./v1/user/route/routes');
    //    const adminroutes = require('./v1/admin/route/routes')
        app.use('/v1/user',    parent_routes)
        // app.use('/v1/admin',adminroutes)
    }
    
}
module.exports=new routing();