const middleware1 = (req, res, next) => {
   console.log(`middleware 1`);
   next();
 };

 const middleware2 = (req, res, next) => {
  console.log(`middleware Holas`);
  
  next();
};
 
 module.exports = {middleware1, middleware2};