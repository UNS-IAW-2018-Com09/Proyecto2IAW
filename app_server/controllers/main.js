const mongoose = require('mongoose');
const Local = mongoose.model('local2');

/* GET home page */
const index = function(req, res) {
	Local
		.find()
		.exec((err, locales) => {
			if (err) { 
				res.render('error', {
					error : err
				});    
	        } else {
				res.send(JSON.stringify(locales));
			}
		})
};


module.exports = {
  index
}; 
