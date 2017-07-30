const rp = require('request-promise'); 
const API_KEY = "ak_test_grXijQ4GicOa2BLGZrDRTR5qNQxJW0";
module.exports = function (app){
	app.get("/", function(req,res){
		res.render("teste/index");
	});
	
	app.post("/", function(req,res){
		var dados_da_transacao = {
			"amount": "1000", 
			"api_key": API_KEY, 
			"card_hash": req.body.card_hash, 
			"installments": 1, //Parcelas
			"payment_method":"credit_card",
			"customer": {
				"address": {
					"neighborhood": "Cidade Mon\u00e7\u00f5es", 
					"street": "Rua Dr.Geraldo Campos Moreira", 
					"street_number": "240", 
					"zipcode": "04571020"
				}, 
				"document_number": "92545278157", 
				"email": "jappleseed@apple.com", 
				"name": "John Appleseed", 
				"phone": {
					"ddd": "11", 
					"number": "15510101"
				}
			},
			"metadata": {
				"id": "999",
				"pedido": {
					"product": {
						"cost": "2500", 
						"name": "Swimming Cap"
					}
				}
			},
			"postback_url": "http://requestb.in/pkt7pgpk"
			
			//O valor a ser retido do total sera 5%
			//(2,5% para CCP e 2,5% para operadora do cartao)
			//Acrescenter o campo split_rules para cada fornecedor:
			//Array de objetos
			//"split_rules": [
			//	{
			//	  "recipient_id": "re_civb4p9l7004xbm6dhsetkpj8",
			//	  "amount": 50,
			//	  "liable": true, //indica se o recebedor atrelado assumirá os riscos de chargeback da transação
			//	  "charge_processing_fee": true //Vai pagar as taxas
			//	},{
			//	  "recipient_id": "re_civb4o6zr003u3m6e8dezzja6",
			//	  "amount": 50,
			//	  "liable": true, //indica se o recebedor atrelado assumirá os riscos de chargeback da transação
			//	  "charge_processing_fee": true //Vai pagar as taxas
			//	}
			//  ]
			
			
			
		};
		
		
		var opcoes = {  
		  method: 'POST',
		  uri: 'https://api.pagar.me/1/transactions',
		  body: dados_da_transacao,
		  json: true // JSON stringifies the body automatically
		}
		
		rp(opcoes).then(function (response) {
			console.log(response);
			//Campos que devem ser utilizados
			//"tid": 1627800,
			//"nsu": 1627800,
			//"date_created": "2017-06-17T19:50:22.982Z",
			//"authorized_amount": 1000,
			//"paid_amount": 1000,
			//"card_holder_name": "Aardvark da Silva",
			//"card_last_digits": "2122",
			//"card_first_digits": "455636",
			//"card_brand": "visa",
			//"payment_method": "credit_card",
			//"capture_method": "ecommerce",
			
			var status = response.status;
			if (status =="paid"){
				//Mostrar mensagem de sucesso
			}
			
			
			res.status(200).json({"resultado":"OK"});
		}).catch(function (err) {
			//console.log(err)
			var codigo_erro = err.statusCode;
			var mensagem_erro = err.statusMessage;
			var resposta = {
				"resultado":"erro",
				"codigo": codigo_erro,
				"mensagem":mensagem_erro
			}
			res.status(500).json(resposta);	
		});
		
		
	});
	
	app.get("/cep", function(req,res){
		res.render("teste/cep");
	});
	
	app.post("/cep", function(req,res){
		var cep = req.body.cep;
		var opcoes = {  
		  method: 'GET',
		  uri: 'https://api.pagar.me/1/zipcodes/' + cep
		}
		rp(opcoes).then((data) => {
			res.status(200).json({"resultado":"OK", "Endereco": data});	
		}).catch((err) => {
			console.log(err)
			res.status(500).json({"resultado":"ERRO DE COMUNICACAO"});	
		});
		
	});
	
	app.post("/postback", function(req,res){
		
		var id = req.body.id;
		var ievent = req.body.event;
		var iold_status = req.body.old_status;
		var idesired_status = req.body.desired_status;
		var icurrent_status = req.body.current_status;
		var iobject = req.body.object;
		var itransaction = req.body.transaction; //Possui todas as informações do objeto. Para var acessar objetos internos basta acessar a chave transaction[objeto1][objeto2]. Ex: para acessar o ddd: transaction[phone][ddd]
		
		if (id ==""){
			res.status(500).json({"resultado":"ERRO"});	
		} else {
			res.status(200).json({"resultado":"OK"});	
		}
		
	});
	
	app.get("/banco", function(req,res){
		var bancos = [
			{'code': '001', 'name': 'Banco do Brasil'},
			{'code': '003', 'name': 'Banco da Amazônia'},
			{'code': '004', 'name': 'Banco do Nordeste'},
			{'code': '021', 'name': 'Banestes'},
			{'code': '025', 'name': 'Banco Alfa'},
			{'code': '027', 'name': 'Besc'},
			{'code': '029', 'name': 'Banerj'},
			{'code': '031', 'name': 'Banco Beg'},
			{'code': '033', 'name': 'Banco Santander Banespa'},
			{'code': '036', 'name': 'Banco Bem'},
			{'code': '037', 'name': 'Banpará'},
			{'code': '038', 'name': 'Banestado'},
			{'code': '039', 'name': 'BEP'},
			{'code': '040', 'name': 'Banco Cargill'},
			{'code': '041', 'name': 'Banrisul'},
			{'code': '044', 'name': 'BVA'},
			{'code': '045', 'name': 'Banco Opportunity'},
			{'code': '047', 'name': 'Banese'},
			{'code': '062', 'name': 'Hipercard'},
			{'code': '063', 'name': 'Ibibank'},
			{'code': '065', 'name': 'Lemon Bank'},
			{'code': '066', 'name': 'Banco Morgan Stanley Dean Witter'},
			{'code': '069', 'name': 'BPN Brasil'},
			{'code': '070', 'name': 'Banco de Brasília – BRB'},
			{'code': '072', 'name': 'Banco Rural'},
			{'code': '073', 'name': 'Banco Popular'},
			{'code': '074', 'name': 'Banco J. Safra'},
			{'code': '075', 'name': 'Banco CR2'},
			{'code': '076', 'name': 'Banco KDB'},
			{'code': '096', 'name': 'Banco BMF'},
			{'code': '104', 'name': 'Caixa Econômica Federal'},
			{'code': '107', 'name': 'Banco BBM'},
			{'code': '116', 'name': 'Banco Único'},
			{'code': '151', 'name': 'Nossa Caixa'},
			{'code': '175', 'name': 'Banco Finasa'},
			{'code': '184', 'name': 'Banco Itaú BBA'},
			{'code': '204', 'name': 'American Express Bank'},
			{'code': '208', 'name': 'Banco Pactual'},
			{'code': '212', 'name': 'Banco Matone'},
			{'code': '213', 'name': 'Banco Arbi'},
			{'code': '214', 'name': 'Banco Dibens'},
			{'code': '217', 'name': 'Banco Joh Deere'},
			{'code': '218', 'name': 'Banco Bonsucesso'},
			{'code': '222', 'name': 'Banco Calyon Brasil'},
			{'code': '224', 'name': 'Banco Fibra'},
			{'code': '225', 'name': 'Banco Brascan'},
			{'code': '229', 'name': 'Banco Cruzeiro'},
			{'code': '230', 'name': 'Unicard'},
			{'code': '233', 'name': 'Banco GE Capital'},
			{'code': '237', 'name': 'Bradesco'},
			{'code': '241', 'name': 'Banco Clássico'},
			{'code': '243', 'name': 'Banco Stock Máxima'},
			{'code': '246', 'name': 'Banco ABC Brasil'},
			{'code': '248', 'name': 'Banco Boavista Interatlântico'},
			{'code': '249', 'name': 'Investcred Unibanco'},
			{'code': '250', 'name': 'Banco Schahin'},
			{'code': '252', 'name': 'Fininvest'},
			{'code': '254', 'name': 'Paraná Banco'},
			{'code': '263', 'name': 'Banco Cacique'},
			{'code': '265', 'name': 'Banco Fator'},
			{'code': '266', 'name': 'Banco Cédula'},
			{'code': '300', 'name': 'Banco de la Nación Argentina'},
			{'code': '318', 'name': 'Banco BMG'},
			{'code': '320', 'name': 'Banco Industrial e Comercial'},
			{'code': '356', 'name': 'ABN Amro Real'},
			{'code': '341', 'name': 'Itau'},
			{'code': '347', 'name': 'Sudameris'},
			{'code': '351', 'name': 'Banco Santander'},
			{'code': '353', 'name': 'Banco Santander Brasil'},
			{'code': '366', 'name': 'Banco Societe Generale Brasil'},
			{'code': '370', 'name': 'Banco WestLB'},
			{'code': '376', 'name': 'JP Morgan'},
			{'code': '389', 'name': 'Banco Mercantil do Brasil'},
			{'code': '394', 'name': 'Banco Mercantil de Crédito'},
			{'code': '399', 'name': 'HSBC'},
			{'code': '409', 'name': 'Unibanco'},
			{'code': '412', 'name': 'Banco Capital'},
			{'code': '422', 'name': 'Banco Safra'},
			{'code': '453', 'name': 'Banco Rural'},
			{'code': '456', 'name': 'Banco Tokyo Mitsubishi UFJ'},
			{'code': '464', 'name': 'Banco Sumitomo Mitsui Brasileiro'},
			{'code': '477', 'name': 'Citibank'},
			{'code': '479', 'name': 'Itaubank (antigo Bank Boston)'},
			{'code': '487', 'name': 'Deutsche Bank'},
			{'code': '488', 'name': 'Banco Morgan Guaranty'},
			{'code': '492', 'name': 'Banco NMB Postbank'},
			{'code': '494', 'name': 'Banco la República Oriental del Uruguay'},
			{'code': '495', 'name': 'Banco La Provincia de Buenos Aires'},
			{'code': '505', 'name': 'Banco Credit Suisse'},
			{'code': '600', 'name': 'Banco Luso Brasileiro'},
			{'code': '604', 'name': 'Banco Industrial'},
			{'code': '610', 'name': 'Banco VR'},
			{'code': '611', 'name': 'Banco Paulista'},
			{'code': '612', 'name': 'Banco Guanabara'},
			{'code': '613', 'name': 'Banco Pecunia'},
			{'code': '623', 'name': 'Banco Panamericano'},
			{'code': '626', 'name': 'Banco Ficsa'},
			{'code': '630', 'name': 'Banco Intercap'},
			{'code': '633', 'name': 'Banco Rendimento'},
			{'code': '634', 'name': 'Banco Triângulo'},
			{'code': '637', 'name': 'Banco Sofisa'},
			{'code': '638', 'name': 'Banco Prosper'},
			{'code': '643', 'name': 'Banco Pine'},
			{'code': '652', 'name': 'Itaú Holding Financeira'},
			{'code': '653', 'name': 'Banco Indusval'},
			{'code': '654', 'name': 'Banco A.J. Renner'},
			{'code': '655', 'name': 'Banco Votorantim'},
			{'code': '707', 'name': 'Banco Daycoval'},
			{'code': '719', 'name': 'Banif'},
			{'code': '721', 'name': 'Banco Credibel'},
			{'code': '734', 'name': 'Banco Gerdau'},
			{'code': '735', 'name': 'Banco Pottencial'},
			{'code': '738', 'name': 'Banco Morada'},
			{'code': '739', 'name': 'Banco Galvão de Negócios'},
			{'code': '740', 'name': 'Banco Barclays'},
			{'code': '741', 'name': 'BRP'},
			{'code': '743', 'name': 'Banco Semear'},
			{'code': '745', 'name': 'Banco Citibank'},
			{'code': '746', 'name': 'Banco Modal'},
			{'code': '747', 'name': 'Banco Rabobank International'},
			{'code': '748', 'name': 'Banco Cooperativo Sicredi'},
			{'code': '749', 'name': 'Banco Simples'},
			{'code': '751', 'name': 'Dresdner Bank'},
			{'code': '752', 'name': 'BNP Paribas'},
			{'code': '753', 'name': 'Banco Comercial Uruguai'},
			{'code': '755', 'name': 'Banco Merrill Lynch'},
			{'code': '756', 'name': 'Banco Cooperativo do Brasil'},
			{'code': '757', 'name': 'KEB'}
			];
		
		res.render("teste/banco", {lista: bancos});
	});
	
	app.post("/banco", function(req,res){
		var dados_bancarios = {
			"agencia": req.body.agencia,
			"agencia_dv":  req.body.agencia_dv, 
			"api_key": API_KEY, 
			"bank_code": req.body.bank_code,
			"conta": req.body.conta,
			"conta_dv": req.body.conta_dv,
			"document_number": req.body.document_number, 
			"legal_name": req.body.legal_name
		};
		var opcoes = {  
		  method: 'POST',
		  uri: 'https://api.pagar.me/1/bank_accounts',
		  body: dados_bancarios,
		  json: true // JSON stringifies the body automatically
		}
		rp(opcoes).then((data) => {
			res.status(200).json({"resultado":"OK", "ID_banco": data.id});	
		}).catch((err) => {
			var codigo_erro = err.statusCode;
			var mensagem_erro = err.statusMessage;
			var resposta = {
				"resultado":"erro",
				"codigo": codigo_erro,
				"mensagem":mensagem_erro
			}
			res.status(500).json(resposta);	
		});
	});	
	
	app.get("/listarbancos", function(req,res){
		var opcoes = {  
		  method: 'GET',
		  uri: 'https://api.pagar.me/1/bank_accounts',
		  qs: {
			api_key: API_KEY
		  }
		  
		}
		rp(opcoes).then((data) => {
			res.status(200).json({"resultado":"OK", "Dados": data});	
		}).catch((err) => {
			//console.log(err)
			var codigo_erro = err.statusCode;
			var mensagem_erro = err.statusMessage;
			var resposta = {
				"resultado":"erro",
				"codigo": codigo_erro,
				"mensagem":mensagem_erro
			}
			res.status(500).json(resposta);	
		});
	});
	
	app.get("/recebedores", function(req,res){
		res.render("teste/recebedores");
	});
	
	app.post("/recebedores", function(req,res){
		var dados_bancarios = {
			"anticipatable_volume_percentage": "85",
			"api_key": API_KEY, 
			"automatic_anticipation_enabled": "true", 
			"bank_account_id": req.body.bank_account_id, 
			"transfer_day": "5", 
			"transfer_enabled": "true", 
			"transfer_interval": "weekly"
		};
		var opcoes = {  
		  method: 'POST',
		  uri: 'https://api.pagar.me/1/recipients',
		  body: dados_bancarios,
		  json: true // JSON stringifies the body automatically
		}
		rp(opcoes).then((data) => {
			res.status(200).json({"resultado":"OK", "ID_recebedor": data.id});	
		}).catch((err) => {
			var codigo_erro = err.statusCode;
			var mensagem_erro = err.statusMessage;
			var resposta = {
				"resultado":"erro",
				"codigo": codigo_erro,
				"mensagem":mensagem_erro
			}
			res.status(500).json(resposta);	
		});
	});
	
	app.get("/listarrecebedores", function(req,res){
		var opcoes = {  
		  method: 'GET',
		  uri: 'https://api.pagar.me/1/recipients',
		  qs: {
			api_key: API_KEY
		  }
		  
		}
		rp(opcoes).then((data) => {
			res.status(200).json({"resultado":"OK", "Dados": data});	
		}).catch((err) => {
			//console.log(err)
			var codigo_erro = err.statusCode;
			var mensagem_erro = err.statusMessage;
			var resposta = {
				"resultado":"erro",
				"codigo": codigo_erro,
				"mensagem":mensagem_erro
			}
			res.status(500).json(resposta);	
		});
	});
	
	app.get("/saldo", function(req,res){
		var opcoes = {  
		  method: 'GET',
		  uri: 'https://api.pagar.me/1/balance',
		  qs: {
			api_key: API_KEY
		  }
		  
		}
		rp(opcoes).then((data) => {
			res.status(200).json({"resultado":"OK", "Dados": data});	
		}).catch((err) => {
			//console.log(err)
			var codigo_erro = err.statusCode;
			var mensagem_erro = err.statusMessage;
			var resposta = {
				"resultado":"erro",
				"codigo": codigo_erro,
				"mensagem":mensagem_erro
			}
			res.status(500).json(resposta);	
		});
	});
	
	app.get("/saldorecebedor", function(req,res){
		//http://localhost:3000/saldorecebedor?recebedor=xxxxxxxxxx
		recebedor = req.query.recebedor;
		var opcoes = {  
		  method: 'GET',
		  uri: 'https://api.pagar.me/1/recipients/' + recebedor + '/balance',
		  qs: {
			api_key: API_KEY
		  }
		  
		}
		rp(opcoes).then((data) => {
			res.status(200).json({"resultado":"OK", "Dados": data});	
		}).catch((err) => {
			//console.log(err)
			var codigo_erro = err.statusCode;
			var mensagem_erro = err.statusMessage;
			var resposta = {
				"resultado":"erro",
				"codigo": codigo_erro,
				"mensagem":mensagem_erro
			}
			res.status(500).json(resposta);	
		});
	});
	
	app.get("/pesquisa", function(req,res){
		var dados_pesquisa = {
			"query":{"filtered": {"query": {"match_all": {}},
			  "filter": {
				"and": [
				  {
					"range": {
					  "date_created": {
						"lte": "2017-07-30",
						"gte": "2017-09-01"
					  }
					}
				  }
				]
			  }
			}
		  }
		};
		
		var opcoes = {  
		  method: 'GET',
		  uri: 'https://api.pagar.me/1/search',
		  qs: {
			api_key: API_KEY,
			type: "transaction",
		    query : JSON.stringify(dados_pesquisa)
		  }
		}  
		rp(opcoes).then((data) => {
			res.status(200).json({"resultado":"OK", "Dados": data});	
		}).catch((err) => {
			console.log(err)
			var codigo_erro = err.statusCode;
			var mensagem_erro = err.statusMessage;
			var resposta = {
				"resultado":"erro",
				"codigo": codigo_erro,
				"mensagem":mensagem_erro
			}
			res.status(500).json(resposta);	
		});
	});
	
	app.get("/qrcodeimg", function(req,res){
		var qr = require('qr-image');  
		var code = qr.image('http://www.google.com.br', { type: 'png' });  
		res.type('png');
		code.pipe(res);
	});
	
	app.get("/qrcode", function(req,res){
		res.render("teste/qrcode");
	});
	
	
	app.get("/regrasdivisao", function(req,res){
		//http://localhost:3000/regrasdivisao?transacao=xxxxxxxxxx
		transacao = req.query.transacao;
		var opcoes = {  
		  method: 'GET',
		  uri: 'https://api.pagar.me/1/transactions/' + transacao + '/split_rules',
		  qs: {
			api_key: API_KEY
		  }
		  
		}
		rp(opcoes).then((data) => {
			//Array de objetos. Formato
			//Tambem existe ao finalizar a transacao (campo split_rules)
			//{
			//	"object": "split_rule",
			//	"id": "sr_ci7ntawl1001s2m164zrbp7tz",
			//	"recipient_id": "re_ci7nhf1ay0007n016wd5t22nl",
			//	"charge_processing_fee": true,
			//	"charge_remainder": true,
			//	"liable": true,
			//	"percentage": 30,
			//	"amount": null,
			//	"date_created": "2015-03-24T21:26:09.000Z",
			//	"date_updated": "2015-03-24T21:26:09.000Z"
			//}
			
			res.status(200).json({"resultado":"OK", "Dados": data});	
		}).catch((err) => {
			//console.log(err)
			var codigo_erro = err.statusCode;
			var mensagem_erro = err.statusMessage;
			var resposta = {
				"resultado":"erro",
				"codigo": codigo_erro,
				"mensagem":mensagem_erro
			}
			res.status(500).json(resposta);	
		});
	});
	
	app.post("/estorno", function(req,res){
		
		var id_transacao = 1627836;
		var dados_bancarios = {
			"api_key": API_KEY,
			"async": "false",
			"amount": "71000",
			"split_rules": [
				{
					"id": "sr_cj41w9m4d01ta316d02edaqav",
					"amount": "60000",
					"recipient_id": "re_cj2wd5ul500d4946do7qtjrvk"
				},
				{
					"id": "sr_cj41w9m4e01tb316dl2f2veyz",
					"amount": "11000",
					"recipient_id": "re_cj2wd5u2600fecw6eytgcbkd0",
					"charge_processing_fee": "true"
				}
			 ]
		};
		var opcoes = {  
		  method: 'POST',
		  uri: 'https://api.pagar.me/1/transactions/' + id_transacao + '/refund',
		  body: dados_bancarios,
		  json: true // JSON stringifies the body automatically
		}
		rp(opcoes).then((data) => {
			res.status(200).json({"resultado":"OK"});	
		}).catch((err) => {
			var codigo_erro = err.statusCode;
			var mensagem_erro = err.statusMessage;
			var resposta = {
				"resultado":"erro",
				"codigo": codigo_erro,
				"mensagem":mensagem_erro
			}
			res.status(500).json(resposta);	
		});
	});
}