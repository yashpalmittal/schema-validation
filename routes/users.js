var express = require('express');
var router = express.Router();
var Ajv = require('ajv');
var userSchema=require("../schemas/userSchema.json");
var jobSeekerSchema=require("../public/jobseekerSchema.json");
var request=require('request')
var ajv = Ajv({
	allErrors:true,
	missingSchema:true,
	loadSchema:loadSchema
}); 

function loadSchema(uri,callback){
	request.get("http://localhost:7000/"+uri, function(err, res, body) {
		if (err || res.statusCode >= 400)
			callback(err || new Error('Loading error: ' + res.statusCode));
		else
			callback(null, JSON.parse(body));
	});
}

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.json({"status":"success"});
});

router.post('/',function(req,res,next){
	var validate=ajv.compileAsync(userSchema,function(error,validate){
		var valid=validate(req.body);
		if (!valid){
			res.json({"status":"failure","errors":error});
		}else{
			res.json({"status":"success"});
		}	
	});
	
});


router.post('/jobseeker',function(req,res,next){
	console.log(jobSeekerSchema);
	ajv.compileAsync(jobSeekerSchema,function(error,validate){
		// if (error){
		// 	res.json({"statusssss":"failure","error":error, "irnhgin": "tinyoin"});
		// 	return;
		// }
		var valid=validate(req.body);
		if (!valid){
			res.json({"status":"failure","errors":validate.errors});
		}else{
			res.json({"status":"success"});
		}	
	});
	
});


module.exports = router;
