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
			oView.getModel().setProperty("/ChangeInEmissionP",Math.floor(3 + (Math.random() + 1) * 6));
			oView.getModel().setProperty("/ChangeInEmissionE",Math.floor(2 + (Math.random() + 1) * 5));
			var ConsumptionByMonth= new sap.ui.model.json.JSONModel();
			ConsumptionByMonth.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");
				var tData = [];
				var EnergyIntensity = [];
				var EnergyIntensity = [];
					$.each(result, function(i, oElement){
						if(oElement.Month == new Date().getMonth()){
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
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapp.azurewebsites.net/api/ConsumptionByMonth");
		
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
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapp.azurewebsites.net/api/ChangeInCost");
		
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
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapp.azurewebsites.net/api/UsageEstimate");
			
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
			// }, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapp.azurewebsites.net/api/UsageEstimate");
			
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
			//	console.log(ThisMonthTotalCost);
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapp.azurewebsites.net/api/MonthWiseCost?oFilter=ThisMonth");
		
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
				oView.getModel().setProperty("/PredictedThisMonthTotalCost",Math.floor(LastMonthTotalCost + (Math.random() + 1) * 5));
				oView.getModel().setProperty("/PredictedThisMonthTotalPower",Math.floor(LastMonthTotalPower + (Math.random() + 1) * 5));
				oView.getModel().setProperty("/PredictedThisMonthTotalEnergy",Math.floor(LastMonthTotalEnergy + (Math.random() + 1) * 5));
				oView.getModel().setProperty("/PredictedThisMonthSaving",Math.floor(parseFloat(oView.getModel().getProperty("/PredictedThisMonthTotalCost")) - Math.floor(LastMonthTotalCost)));
				
				console.log(LastMonthTotalCost);
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapp.azurewebsites.net/api/MonthWiseCost?oFilter=LastMonth");
		
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
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapp.azurewebsites.net/api/MonthWiseCost?oFilter=SecondLastMonth");
		
			var ActiveAppliances= new sap.ui.model.json.JSONModel();
			ActiveAppliances.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");

				oView.getModel().setProperty("/ActiveAppliances",result);
				//console.log(oEvent.getSource().getProperty("/"));
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapp.azurewebsites.net/api/WebAPI");
			

			that.loadUsageByFloor(oView,"ThisMonth","F1");
			that.loadUsageByFloor(oView,"LastMonth","F1");
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
			var oSelectedFloor = oEvent.getSource().getSelectedKey();
				this.loadUsageByFloor(this.getView(),"ThisMonth",oSelectedFloor);
				//this.getView().getModel().setProperty("/ThisMonthUnit",this.getView().getModel().getProperty("/"+ sItem +"_ThisMonth"));
		},
		onLMListChange : function(oEvent){
			var oSelectedFloor = oEvent.getSource().getSelectedKey();
				this.loadUsageByFloor(this.getView(),"LastMonth",oSelectedFloor);
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
		loadUsageByFloor : function(oView,month,oSelectedFloor){
			console.log("oSelectedFloor : " + oSelectedFloor );
			var UsageByFloor= new sap.ui.model.json.JSONModel();
			UsageByFloor.attachRequestCompleted(function(oEvent) {
				var result = oEvent.getSource().getProperty("/");
					if(result.length == 0){
						result = oView.getModel().getProperty("/BlankData")
					}
				var TotalUsageByFloor = 0;
				var TotalEnergyUsageByFloor = 0;
				var TotalPowerUsageByFloor = 0;
					$.each(result, function(i, oElement){
						oElement.Date = new Date(oElement.Date).getMonth()+1 + "/" 
										+ new Date(oElement.Date).getDate() + "/"
										+ new Date(oElement.Date).getFullYear();
						TotalUsageByFloor = TotalUsageByFloor + parseFloat(oElement.Energy)+ parseFloat(oElement.Power);
						TotalPowerUsageByFloor = TotalPowerUsageByFloor + parseFloat(oElement.Power);
						TotalEnergyUsageByFloor = TotalEnergyUsageByFloor + parseFloat(oElement.Energy);
					});
				oView.getModel().setProperty("/"+month+"Unit",result);
				oView.getModel().setProperty("/TotalUsageByFloor"+month,Math.floor(TotalUsageByFloor / 10));
				oView.getModel().setProperty("/TotalEnergyUsageByFloor"+month,Math.floor(TotalEnergyUsageByFloor / 10));
				oView.getModel().setProperty("/TotalPowerUsageByFloor"+month,Math.floor(TotalPowerUsageByFloor / 10));
				//console.log(oEvent.getSource().getProperty("/"));
			}, this).loadData("https://cors-anywhere.herokuapp.com/http://smartmeterwebapp.azurewebsites.net/api/UsageByFloor?oFilter="+month+"&selectedFloor="+oSelectedFloor);
		}
	});
});