function config_api()
{
  var xumm = {
      "content-type": "application/json",
      "x-api-key": "your_xumm_dev_app_api_key",
      "x-api-secret": "your_xumm_dev_app_api_secret"
    };
  
  return(xumm);
}

function html_code()
{
  
  var iframe_tag = '<iframe src="'+ScriptApp.getService().getUrl()+'/exec?slno=2" height="685" width="310" style="border:none;overflow:hidden;" scrolling="no" frameborder="0"></iframe>';
  Logger.log(iframe_tag);
  return(iframe_tag); 
}

function xrp_price(ticker)
{
    var price = JSON.parse(UrlFetchApp.fetch("https://api.bittrex.com/v3/markets/"+ticker+"-USD/ticker"));
    return(price.lastTradeRate);
  
  /* Deprecated Bittrex API 
  var price = JSON.parse(UrlFetchApp.fetch("https://api.bittrex.com/api/v1.1/public/getticker?market=USD-"+ticker));
  
  if(price.success == true)
    return(price.result.Last);
  else
  {
    // Some other exchanges code here and return the value of XRP
    window.stop();
  }
  */
}


function conversion(slno, currency_id)
{
  var my_currency = currencies();
  //Logger.log("currencies "+JSON.stringify(my_currency));
  var amount;
  
  
     var sheet  = getActiveSheet();
     var target = sheet.getSheetByName("Config");  
     var your_xrp  = target.getRange(2, 4).getValue();  

       var sheet  = getActiveSheet();
     var target = sheet.getSheetByName("Product"); 
     var my_usd_price = target.getRange(slno, 4).getValue();  
  
  var txjson = {"TransactionType":"Payment",
                "Account": "rHdkzpxr3VfabJh9tUEDv7N4DJEsA4UioT",
                "Destination": your_xrp
               };
  
  // 0 for XRP by convention
  if(currency_id == 0) 
  {
      amount = parseInt((my_usd_price / xrp_price("XRP")) * 1000000); 
      //xrp    = amount / 1000000;
      txjson.Amount = amount.toString();
  }
  else
  {
    txjson.Amount = {};
    
  for(var key in my_currency)
  { 
    if(my_currency[key].id == currency_id)
    {
        if(my_currency[key].id == 170)
        {
                txjson.Amount.currency = my_currency[key].currency;
                txjson.Amount.issuer   = my_currency[key].issuer;
                txjson.Amount.value    = my_usd_price.toString();           
        }
        else if(my_currency[key].id == 861)
        {
                txjson.Amount.currency = my_currency[key].currency;
                txjson.Amount.issuer   = my_currency[key].issuer;
                
                var price = JSON.parse(UrlFetchApp.fetch("https://api.coinfield.com/v1/tickers/solousd"));
                if(price.markets.length != 0 || price.markets.length != undefined)
                  txjson.Amount.value    = (my_usd_price / price.markets[0].last).toString();          
        }
        else if(my_currency[key].id == 176)
        {
                txjson.Amount.currency = my_currency[key].currency;
                txjson.Amount.issuer   = my_currency[key].issuer;      
                
                var price = JSON.parse(UrlFetchApp.fetch("https://api.bittrex.com/api/v1.1/public/getticker?market=BTC-REP"));
                
                if(price.success == true)
                {
                  txjson.Amount.value = ( (my_usd_price / ( xrp_price("BTC") * price.result.Last)).toFixed(15)  ).toString();
                }           
        }
        else if(my_currency[key].id == 0)
        {
                amount = parseInt((my_usd_price / xrp_price("XRP")) * 1000000); 
                xrp    = amount / 1000000;
                txjson.Amount = amount.toString();          
        }
        else if(my_currency[key].id == 172)
        {
                txjson.Amount.currency = my_currency[key].currency;
                txjson.Amount.issuer   = my_currency[key].issuer;
                txjson.Amount.value    = ( (my_usd_price / xrp_price("BTC")).toFixed(15) ).toString();          
        } 
        else if(my_currency[key].id == 169)
        {
                txjson.Amount.currency = my_currency[key].currency;
                txjson.Amount.issuer   = my_currency[key].issuer;      
                
                var price = JSON.parse(UrlFetchApp.fetch("https://api.bittrex.com/api/v1.1/public/getticker?market=EUR-USD"));
                
                if(price.success == true)
                {
                  txjson.Amount.value = ( my_usd_price * price.result.Last ).toString();
                }           
        }
        else if(my_currency[key].id == 177)   
        {
                txjson.Amount.currency = my_currency[key].currency;
                txjson.Amount.issuer   = my_currency[key].issuer;
                txjson.Amount.value    = ( (my_usd_price / xrp_price("DASH")).toFixed(15) ).toString();           
        }     
        else if(my_currency[key].id == 9622)   
        {
                txjson.Amount.currency = my_currency[key].currency;
                txjson.Amount.issuer   = my_currency[key].issuer;      
          
                amount = parseInt((my_usd_price / xrp_price("XRP"))); 
                
                var price = JSON.parse(UrlFetchApp.fetch("https://data.ripple.com/v2/exchanges/XRP/XTK+rXTKdHWuppSjkbiKoEv53bfxHAn1MxmTb?descending=true&result=tesSUCCESS&limit=1&interval=2hour"));
                
                if(price.result == 'success')
                {
                  txjson.Amount.value = ( amount * price.exchanges[0].open ).toString();
                }           
        }      
        else if(my_currency[key].id == currency_id)   
        {
                txjson.Amount.currency = my_currency[key].currency;
                txjson.Amount.issuer   = my_currency[key].issuer;
                txjson.Amount.value    = ( (my_usd_price / xrp_price(my_currency[key].currency)).toFixed(15) ).toString();           
        }
    }  
  }    
 }
  //Logger.log("txjson "+JSON.stringify(txjson));
  return(txjson);
  
}

function qr(slno, currency) {
  /* var slno = 4, currency = "0";  */
  
   
     
 
/*  
     var sheet  = getActiveSheet();
     var target = sheet.getSheetByName("Config");  
     var your_xrp  = target.getRange(2, 4).getValue();  
  

     var sheet  = getActiveSheet();
     var target = sheet.getSheetByName("Product"); 
     var my_usd_price = target.getRange(slno, 4).getValue();  
  */

     var txjson = conversion(slno, currency);
     var xrp;
   
     if(currency == 0)
     {
       xrp = txjson.Amount;
     }
     else
     {
       xrp = txjson.Amount.value;
     }
     
  
  // var amount  = parseInt((target.getRange(slno, 4).getValue() / xrp_price()) * 1000000);   
               

   var sheet  = getActiveSheet();
   var target = sheet.getSheetByName("Product");    
  var blob = {
    "products": target.getRange(slno, 1).getValue(),
    "name": target.getRange(slno, 2).getValue(),
    "desc": target.getRange(slno, 3).getValue(),    
    "usd": target.getRange(slno, 4).getValue(),
    "xrp": xrp,
    "image": target.getRange(slno, 5).getValue(),
    "ps": target.getRange(slno, 6).getValue()
  };   


   var url  = "https://xumm.app/api/v1/platform/payload"
   
   var sheet  = getActiveSheet();
   var target = sheet.getSheetByName("Config");
  
   var body = {
       "options":
         { "submit":"true","multisign":"false","expire":"1440"},
      "txjson": txjson,
      "user_token": target.getRange(2, 5).getValue(),
     "custom_meta": { "blob": blob }
    };
  
 
  var params = {
    "method": "POST",
    "headers": config_api(),
    "payload": JSON.stringify(body) 
  };
  
  
  
  var response = JSON.parse(UrlFetchApp.fetch(url, params).getContentText());
  
  var obj = {'price': blob.xrp, qr_code: response.refs.qr_png, 'uuid': response.uuid };
  
 //  Logger.log(obj);
  
  return obj;

}

function doGet() {
      return HtmlService.createTemplateFromFile('embed.html')
        .evaluate() // evaluate MUST come before setting the Sandbox mode
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);  
}


function paid(uuid)
{ 
  var url = "https://xumm.app/api/v1/platform/payload/"+uuid;
  
  
  var options = {
    "method": "GET",
    "headers": config_api(),    
  };
  
  var result = JSON.parse(UrlFetchApp.fetch(url, options));
  
  result.meta.dispatched_nodetype = result.response.dispatched_nodetype;
  result.meta.dispatched_result   = result.response.dispatched_result;
  result.meta.amount = result.payload.request_json.Amount;
  result.meta.custom_meta = result.custom_meta.blob;
 
  return(result.meta);
  
}

function getData(data, uuid)
{ 
  
  var e = paid(uuid);
  //Check for TESTNET
  if(e.dispatched_nodetype != "TESTNET" && e.resolved == true && e.signed == true && e.expired  == false && e.cancelled == false && e.dispatched_result == "tesSUCCESS")
  {    
    data.push(e.custom_meta.name);
    data.push(e.custom_meta.xrp);
    data.push(new Date());
     
    var sheet = getActiveSheet();
    var target = sheet.getSheetByName("Sales");  
    target.appendRow(data);
    
    sendMail(data, e.custom_meta);
    
  }
}


function getActiveSheet()
{  
   var sheet = SpreadsheetApp.getActiveSpreadsheet();

  return(sheet);
}


function sendMail(data, product)
{    
  
     var sheet  = getActiveSheet();
     var target = sheet.getSheetByName("Config");  
     var lastRow   = target.getLastRow();
  
      var your_name  = target.getRange(lastRow, 1).getValue();
      var your_email = target.getRange(lastRow, 2).getValue();
      var your_brand = target.getRange(lastRow, 3).getValue();
      
  
      var newSubject = "Your order for "+product.name+" is here!";
      var htmlBody   = "Dear "+data[0]+", <br /><br />Thank you for your order!<br /><br />Please check the attached files with this email. <br /><br />Regards,<br />"+your_name+"<br />PS: "+product.ps+"<br /><br /><img src='"+your_brand+"' alt='"+product.name+"'>";
      var textBody   = htmlBody.replace(/<[^>]+>/g, ' ');
      var to         = data[2];
      var cc         = your_email;
      var bcc        = '';
  
 
     var contents = DriveApp.getFolderById(product.products).getFiles();
      var attachments = [];
      while (contents.hasNext()) {
        var file = contents.next();
          attachments.push(file);
      }  

      MailApp.sendEmail(to, newSubject, textBody, {
        htmlBody: htmlBody,
        attachments: attachments,
        cc: cc,
        bcc: bcc
      });  


}

function getProductInfo(slno)
{  console.log('slno '+slno);
   var sheet  = getActiveSheet();
   var target = sheet.getSheetByName("Product");  
   var lastRow   = target.getLastRow();
  
  if(slno <= lastRow && slno > 1 )
  {
    var data = {
      "products":  target.getRange(slno, 1).getValue(),
      "name":      target.getRange(slno, 2).getValue(),
      "desc":      target.getRange(slno, 3).getValue(),    
      "usd":       target.getRange(slno, 4).getValue(),
      "xrp":       target.getRange(slno, 4).getValue() / xrp_price("XRP"),
      "image":     target.getRange(slno, 5).getValue()
    };    
  }
  else
  {
    var data = {
      "products":  target.getRange(lastRow , 1).getValue(),
      "name":      target.getRange(lastRow, 2).getValue(),
      "desc":      target.getRange(lastRow, 3).getValue(),    
      "usd":       target.getRange(lastRow, 4).getValue(),
      "xrp":       target.getRange(lastRow, 4).getValue() / xrp_price("XRP"),
      "image":     target.getRange(lastRow, 5).getValue()
    };  
  }

  return data;  
}


function currencies()
{
  

   var url  = "https://xumm.app/api/v1/platform/curated-assets"

  var params = {
    "method": "GET",
    "headers": config_api()
  };
  
  var response = JSON.parse(UrlFetchApp.fetch(url, params).getContentText());
  
  /* Towo Labs */
  response.details.GateHub.currencies.XTK = {
"id":9622,
"issuer_id":2601,
"issuer":"rXTKdHWuppSjkbiKoEv53bfxHAn1MxmTb",
"currency":"XTK",
"name":"XTK",
"avatar":"https://xumm.app/assets/icons/currencies/xtk-symbol.png?1"
};  
  
  response.details.GateHub.currencies.SOLO =  {
"id":861,
"issuer_id":4380,
"issuer":"rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz",
"currency":"534F4C4F00000000000000000000000000000000",
"name":"SOLO",
"avatar":"https://xumm.app/assets/icons/currencies/icon-sologenic.png"
};
  

  
  return( response.details.GateHub.currencies );
  
 }
  


/*
function testCases()
{
   var sheet  = getActiveSheet();
   var target = sheet.getSheetByName("Product");    
   Logger.log(target.getLastRow());
}
*/
