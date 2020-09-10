sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("MSADB.controller.Main", {

		onInit: function () {
			// set explored app's demo model on this sample
			var oModel = new JSONModel(sap.ui.require.toUrl("dataFile/products.json"));
			var oView = this.getView();
			var that = this;
			oView.setModel(oModel);
		//	oView.getModel().setProperty("/ChangeInEmissionP",Math.floor(3 + (Math.random() + 1) * 6));
		//	oView.getModel().setProperty("/ChangeInEmissionE",Math.floor(2 + (Math.random() + 1) * 5));
			var ConsumptionByMonth= new sap.ui.model.json.JSONModel();
			ConsumptionByMonth.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");
				var tData = [];
				var EnergyIntensity = [];
				var EnergyIntensity = [];
					$.each(result, function(i, oElement){
						if(oElement.Month == new Date().getMonth() + 1){
							tData.push({
									"Category": "Energy",
									"Value": oElement.Energy
								},
								{
									"Category": "Power",
									"Value": oElement.Power
								},
								{
									"Category": "Voltage",
									"Value": oElement.Voltage
								});
							EnergyIntensity.push({
								"Name": "Consumed",
								"Value": oElement.Energy
							},
							{
								"Name": "Remaining",
								"Value": 100 - oElement.Energy
							});
						}
					});
				oView.getModel().setProperty("/ConsumptionByMonth",tData);
				oView.getModel().setProperty("/EnergyIntensity",EnergyIntensity);
				//console.log(oEvent.getSource().getProperty("/"));
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapplication.azurewebsites.net/api/ConsumptionByMonth");
		
			var ChangeInCost= new sap.ui.model.json.JSONModel();
			ChangeInCost.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");
					$.each(result, function(i, oElement){
						oElement.Date = new Date(oElement.Date).getMonth()+1 + "/" 
										+ new Date(oElement.Date).getDate() + "/"
										+ new Date(oElement.Date).getFullYear()
					});

				oView.getModel().setProperty("/ChangeInCost",result);
				//console.log(oEvent.getSource().getProperty("/"));
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapplication.azurewebsites.net/api/ChangeInCost");
		
			var UsageEstimate= new sap.ui.model.json.JSONModel();
			UsageEstimate.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");
					$.each(result, function(i, oElement){
						oElement.Date = new Date(oElement.Date).getMonth()+1 + "/" 
										+ new Date(oElement.Date).getDate() + "/"
										+ new Date(oElement.Date).getFullYear()
					});
				oView.getModel().setProperty("/UsageEstimate",result);
				//console.log(oEvent.getSource().getProperty("/"));
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapplication.azurewebsites.net/api/UsageEstimate");
			
			// var UsageEstimate= new sap.ui.model.json.JSONModel();
			// UsageEstimate.attachRequestCompleted(function(oEvent) {
				// var result = oEvent.getSource().getProperty("/");
					// $.each(result, function(i, oElement){
						// oElement.Date = new Date(oElement.Date).getMonth()+1 + "/" 
										// + new Date(oElement.Date).getDate() + "/"
										// + new Date(oElement.Date).getFullYear()
					// });
				// oView.getModel().setProperty("/UsageEstimate",result);
				// //console.log(oEvent.getSource().getProperty("/"));
			// }, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapplication.azurewebsites.net/api/UsageEstimate");
			
			var ThisMonthCost= new sap.ui.model.json.JSONModel();
			var ThisMonthTotalCost = 0;
			var ThisMonthTotalPower = 0;
			var ThisMonthTotalEnergy = 0;
			ThisMonthCost.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");
					$.each(result, function(i, oElement){
						oElement.Date = new Date(oElement.Date).getMonth()+1 + "/" 
										+ new Date(oElement.Date).getDate() + "/"
										+ new Date(oElement.Date).getFullYear();
						ThisMonthTotalCost = ThisMonthTotalCost + parseFloat(oElement.EnergyCost) + parseFloat(oElement.PowerCost);
						ThisMonthTotalPower = ThisMonthTotalPower + parseFloat(oElement.Power);
						ThisMonthTotalEnergy = ThisMonthTotalEnergy + parseFloat(oElement.Energy) ;
					});
				oView.getModel().setProperty("/ThisMonthName",result[0].ThisMonth);
				oView.getModel().setProperty("/LastMonthName",result[0].LastMonth);
				oView.getModel().setProperty("/SecondLastMonthName",result[0].SecondLastMonth);
				oView.getModel().setProperty("/ThisMonthCost",result);
				oView.getModel().setProperty("/ThisMonthTotalCost",Math.floor(ThisMonthTotalCost));
				oView.getModel().setProperty("/ThisMonthTotalPower",Math.floor(ThisMonthTotalPower));
				oView.getModel().setProperty("/ThisMonthTotalEnergy",Math.floor(ThisMonthTotalEnergy));
				
				var date = new Date();
				var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
				var perDayCost = parseFloat(ThisMonthTotalCost) / parseFloat(date.getDate());
				var perDayPower = parseFloat(ThisMonthTotalPower) / parseFloat(date.getDate());
				var perDayEnergy = parseFloat(ThisMonthTotalEnergy) / parseFloat(date.getDate());
				var predictedThisMonthTotalCost = Math.floor(perDayCost * lastDay);
				var predictedThisMonthTotalPower = Math.floor(perDayPower * lastDay);
				var predictedThisMonthTotalEnergy = Math.floor(perDayEnergy * lastDay);
				oView.getModel().setProperty("/PredictedThisMonthTotalCost",predictedThisMonthTotalCost);
				oView.getModel().setProperty("/PredictedThisMonthTotalPower",predictedThisMonthTotalPower);
				oView.getModel().setProperty("/PredictedThisMonthTotalEnergy",predictedThisMonthTotalEnergy);
				
			//	console.log(ThisMonthTotalCost);
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapplication.azurewebsites.net/api/MonthWiseCost?oFilter=ThisMonth");
		
			var LastMonthCost= new sap.ui.model.json.JSONModel();
			var LastMonthTotalCost = 0;
			var LastMonthTotalPower = 0;
			var LastMonthTotalEnergy = 0;
			LastMonthCost.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");
					$.each(result, function(i, oElement){
						oElement.Date = new Date(oElement.Date).getMonth()+1 + "/" 
										+ new Date(oElement.Date).getDate() + "/"
										+ new Date(oElement.Date).getFullYear();
						LastMonthTotalCost = LastMonthTotalCost + parseFloat(oElement.EnergyCost) + parseFloat(oElement.PowerCost);
						LastMonthTotalPower = LastMonthTotalPower + parseFloat(oElement.Power);
						LastMonthTotalEnergy = LastMonthTotalEnergy + parseFloat(oElement.Energy) ;
						
					});
				oView.getModel().setProperty("/LastMonthCost",result);
				oView.getModel().setProperty("/LastMonthTotalCost",Math.floor(LastMonthTotalCost));
				oView.getModel().setProperty("/LastMonthTotalPower",Math.floor(LastMonthTotalPower));
				oView.getModel().setProperty("/LastMonthTotalEnergy",Math.floor(LastMonthTotalEnergy));
				//oView.getModel().setProperty("/PredictedThisMonthTotalCost",Math.floor(LastMonthTotalCost + (Math.random() + 1) * 5));
				//oView.getModel().setProperty("/PredictedThisMonthTotalPower",Math.floor(LastMonthTotalPower + (Math.random() + 1) * 5));
				//oView.getModel().setProperty("/PredictedThisMonthTotalEnergy",Math.floor(LastMonthTotalEnergy + (Math.random() + 1) * 5));
				oView.getModel().setProperty("/PredictedThisMonthSaving",Math.floor(LastMonthTotalCost) - Math.floor(parseFloat(oView.getModel().getProperty("/PredictedThisMonthTotalCost"))));
				that.loadSecondLastMonthCost(oView);
				
				
			oView.getModel().setProperty("/ChangeInEmissionP",Math.floor(LastMonthTotalPower - parseFloat(oView.getModel().getProperty("/PredictedThisMonthTotalPower"))));
			oView.getModel().setProperty("/ChangeInEmissionE",Math.floor(LastMonthTotalEnergy - parseFloat(oView.getModel().getProperty("/PredictedThisMonthTotalEnergy"))));
				console.log(LastMonthTotalCost);
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapplication.azurewebsites.net/api/MonthWiseCost?oFilter=LastMonth");
		
			var ActiveAppliances= new sap.ui.model.json.JSONModel();
			ActiveAppliances.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");

				oView.getModel().setProperty("/ActiveAppliances",result);
				//console.log(oEvent.getSource().getProperty("/"));
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapplication.azurewebsites.net/api/WebAPI");
			

			that.loadUsageByWC(oView,"ThisMonth","P1");
			that.loadUsageByWC(oView,"LastMonth","P1");
			that.loadAlertByFilter(oView,"Category");
			that.loadAlertByFilter(oView,"Priority");
			that.loadAlertByFilter(oView,"WorkCenter");
			that.loadAlertByFilter(oView,"Date");
			that.loadAlertDetails(oView);
			that.loadUsageByWCOverview(oView);
			setTimeout(function(){ that.loadEmission();}, 10000);
			
			
		},
		onMasterListItemPress : function(oEvent){
			// var oListItem = oEvent.getParameter("listItem");
			// var sPath = oListItem.getBindingContextPath();
			// var oSelectedItemName = this.getView().getModel().getProperty(sPath).TargetPage;
			// console.log(oSelectedItemName);
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},
		getSplitAppObj: function () {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},
		onTMListChange : function(oEvent){
			var oSelectedPlant = oEvent.getSource().getSelectedKey();
				this.loadUsageByWC(this.getView(),"ThisMonth",oSelectedPlant);
				//this.getView().getModel().setProperty("/ThisMonthUnit",this.getView().getModel().getProperty("/"+ sItem +"_ThisMonth"));
		},
		onLMListChange : function(oEvent){
			var oSelectedPlant = oEvent.getSource().getSelectedKey();
				this.loadUsageByWC(this.getView(),"LastMonth",oSelectedPlant);
				//this.getView().getModel().setProperty("/LastMonthUnit",this.getView().getModel().getProperty("/"+ sItem +"_LastMonth"));
		},
		loadEmission : function(){
			var oView = this.getView();
			var oThisMonthCost = oView.getModel().getProperty("/ThisMonthCost");
			var oLastMonthCost = oView.getModel().getProperty("/LastMonthCost");
				$.each(oThisMonthCost, function(i, oElement){
							oElement.LastMonthEnergy = 0;
							oElement.LastMonthPower = 0;
							oElement.LastMonthVoltage = 0;				
					$.each(oLastMonthCost,function(j, ele){
						if(ele.Day == oElement.Day){
							oElement.LastMonthEnergy = ele.Energy;
							oElement.LastMonthPower = ele.Power;
							oElement.LastMonthVoltage = ele.Voltage;
						}
					});
				});
				console.log(oThisMonthCost);
		},
		loadUsageByWC : function(oView,month,oSelectedPlant){
			console.log("oSelectedPlant : " + oSelectedPlant );
			var UsageByWC= new sap.ui.model.json.JSONModel();
			UsageByWC.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");
					if(result.length == 0){
						result = oView.getModel().getProperty("/BlankData")
					}
				var TotalUsageByWC = 0;
				var TotalEnergyUsageByWC = 0;
				var TotalPowerUsageByWC = 0;
					$.each(result, function(i, oElement){
						oElement.Date = new Date(oElement.Date).getMonth()+1 + "/" 
										+ new Date(oElement.Date).getDate() + "/"
										+ new Date(oElement.Date).getFullYear();
						TotalUsageByWC = TotalUsageByWC + parseFloat(oElement.Energy)+ parseFloat(oElement.Power);
						TotalPowerUsageByWC = TotalPowerUsageByWC + parseFloat(oElement.Power);
						TotalEnergyUsageByWC = TotalEnergyUsageByWC + parseFloat(oElement.Energy);
					});
				oView.getModel().setProperty("/"+month+"Unit",result);
				oView.getModel().setProperty("/TotalUsageByWC"+month,Math.floor(TotalUsageByWC / 10));
				oView.getModel().setProperty("/TotalEnergyUsageByWC"+month,Math.floor(TotalEnergyUsageByWC / 10));
				oView.getModel().setProperty("/TotalPowerUsageByWC"+month,Math.floor(TotalPowerUsageByWC / 10));
				//console.log(oEvent.getSource().getProperty("/"));
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapplication.azurewebsites.net/api/UsageByFloor?oFilter="+month+"&selectedFloor="+oSelectedPlant);
		},
		loadAlertByFilter : function(oView,oFilter){
			var AlertByFilter= new sap.ui.model.json.JSONModel();
			AlertByFilter.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");
				if(oFilter == "Date"){
					$.each(result, function(i, oElement){
						oElement.Name = new Date(oElement.Name).getMonth()+1 + "/" 
										+ new Date(oElement.Name).getDate() + "/"
										+ new Date(oElement.Name).getFullYear();
					});					
				}
				oView.getModel().setProperty("/AlertBy"+oFilter,result);


			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapplication.azurewebsites.net/api/AlertByFilter?oFilter="+oFilter);
		},
		loadAlertDetails : function(oView){
			var AlertDetails= new sap.ui.model.json.JSONModel();
			AlertDetails.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");
				var openStatusCount = 0;
				var closeStatusCount = 0;
				var wipStatusCount = 0;
					$.each(result, function(i, oElement){
						if(oElement.Start!="" || oElement.Start!="null" ){
							oElement.Start = new Date(oElement.Start).getMonth()+1 + "/" 
											+ new Date(oElement.Start).getDate() + "/"
											+ new Date(oElement.Start).getFullYear();
						}
						if(oElement.End!="" || oElement.End!="null" ){
							oElement.End = new Date(oElement.End).getMonth()+1 + "/" 
											+ new Date(oElement.End).getDate() + "/"
											+ new Date(oElement.End).getFullYear();
						}
						if(oElement.Status == "Open"){
							openStatusCount += 1;
						}
						if(oElement.Status == "Close"){
							closeStatusCount += 1;
						}
						if(oElement.Status == "Wip"){
							wipStatusCount += 1;
						}
					});	
				oView.getModel().setProperty("/AlertDetails",result);
				oView.getModel().setProperty("/openStatusCount",openStatusCount);
				oView.getModel().setProperty("/closeStatusCount",closeStatusCount);
				oView.getModel().setProperty("/wipStatusCount",wipStatusCount);
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapplication.azurewebsites.net/api/AlertDetails");
		},
		loadSecondLastMonthCost : function(oView){
			var SecondLastMonthCost= new sap.ui.model.json.JSONModel();
			var SecondLastMonthTotalCost = 0;
			SecondLastMonthCost.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");
					$.each(result, function(i, oElement){
						oElement.Date = new Date(oElement.Date).getMonth()+1 + "/" 
										+ new Date(oElement.Date).getDate() + "/"
										+ new Date(oElement.Date).getFullYear();
						SecondLastMonthTotalCost = SecondLastMonthTotalCost + parseFloat(oElement.EnergyCost) + parseFloat(oElement.PowerCost)
					});
				oView.getModel().setProperty("/SecondLastMonthTotalCost",Math.floor(SecondLastMonthTotalCost));
				oView.getModel().setProperty("/LastMonthSaving",Math.floor(SecondLastMonthTotalCost - parseFloat(oView.getModel().getProperty("/LastMonthTotalCost"))));
				console.log(SecondLastMonthTotalCost);
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapplication.azurewebsites.net/api/MonthWiseCost?oFilter=SecondLastMonth");
		},
		loadUsageByWCOverview : function(oView){
			var UsageByWC= new sap.ui.model.json.JSONModel();
			UsageByWC.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");
					$.each(result, function(i, oElement){
						// oElement.Date = new Date(oElement.Date).getMonth()+1 + "/" 
										// + new Date(oElement.Date).getDate() + "/"
										// + new Date(oElement.Date).getFullYear();
						// SecondLastMonthTotalCost = SecondLastMonthTotalCost + parseFloat(oElement.EnergyCost) + parseFloat(oElement.PowerCost)
					});
				oView.getModel().setProperty("/UsageByWC",result);
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapplication.azurewebsites.net/api/UsageByWC");
		}
	});
});