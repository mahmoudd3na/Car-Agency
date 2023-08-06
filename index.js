const {customers} = require('./customer-data');
const {agencies} = require('./agency-data');
const {taxesAuthority} = require('./taxesAuthority');


const CarAgencyManager = {

      
  // Search for a car agency by its name or ID.
  // @param {string} idOrName - ID or name of the agency
  // @return {object} - agency object if found, otherwise null
  searchAgency: function (idOrName) {
    const agency = agencies.filter(agency => agency.agencyName  === idOrName || agency.agencyId === idOrName); 
    if(agency)
    return agency; 
    else return "agency not found";
  },

  // Retrieve all agencies' names.
  // @return {string[]} - Array of agency names
  getAllAgencies: function () {
    return this.agencies.map(agency => agency.agencyName);
  },

  getCar : function (carId){
    const cars=  agencies.map(agency => agency.cars);
    for (let car of cars)
        for(let carBrand of car)
                for(let model of carBrand.models)
                    if(model.carNumber === carId)
                        return model;  
        
    return false; 

  },

  // Add a new car to an agency's inventory.
  // @param {string} agencyId - The ID of the agency
  // @param {object} car - The car object to be added
  // @return {boolean} - true if added successfully, false otherwise
  addCarToAgency: function (agencyId, car) {
    const agency =agencies.find(agency => agency.agencyId === agencyId);
    if(agency){
        const brand =agency.cars.find(vehicle => vehicle.brand === car.brand);
        brand.models.push(car.model);
        return true;
}
return false; 
},


  // Remove a car from an agency's inventory.
  // @param {string} agencyId - The ID of the agency
  // @param {string} carId - The ID of the car to be removed
  // @return {boolean} - true if removed successfully, false otherwise
  removeCarFromAgency: function (agencyId, carId) {
    const agency =agencies.find(agency => agency.agencyId === agencyId);
    if(agency){
        for( let car of agency.cars)
            car.models= car.models.filter(model => model.carNumber !== carId); 
        return true; 
    }
    return false; 
  },

  // Change the cash or credit of an agency.
  // @param {string} agencyId - The ID of the agency
  // @param {number} cashOrCredit - The amount of cash or credit to be updated
  // @return {boolean} - true if updated successfully, false otherwise
  changeAgencyCashOrCredit: function (agencyId, cashOrCredit) {
    const agency =agencies.find(agency => agency.agencyId === agencyId);
    if(agency) {
        agency.cash+=cashOrCredit; 
        return true;
    }
    return false; 
  },

  // Update the price of a specific car in an agency.
  // @param {string} agencyId - The ID of the agency
  // @param {string} carId - The ID of the car
  // @param {number} newPrice - The new price of the car
  // @return {boolean} - true if updated successfully, false otherwise
  updateCarPrice: function (agencyId, carId, newPrice) {
    const agency =agencies.find(agency => agency.agencyId === agencyId);
    if(agency)
        for( let car of agency.cars){
            const vehicle= car.models.find(model => model.carNumber === carId); 
            vehicle.price=newPrice; 
            return true;
        }
    return false; 
  },

  // Calculate and return the total revenue for a specific agency.
  // @param {string} agencyId - The ID of the agency
  // @return {number} - The total revenue of the agency
  getTotalAgencyRevenue: function (agencyId) {
    const agency =agencies.find(agency => agency.agencyId === agencyId);
    return agency.cash + agency.credit; 
  },

  // Transfer a car from one agency to another.
  // @param {string} fromAgencyId - The ID of the agency from where the car will be transferred
  // @param {string} toAgencyId - The ID of the agency to where the car will be transferred
  // @param {string} carId - The ID of the car to be transferred
  // @return {boolean} - true if transferred successfully, false otherwise
  transferCarBetweenAgencies: function (fromAgencyId, toAgencyId, carId) {
    const agency =agencies.find(agency => agency.agencyId === fromAgencyId);
    let vehicle={brand:"",model:{}}; //for some fucking reason it keeps telling me brand is not defined so i had to initialize it 
    if(agency)
        for( let car of agency.cars){
            vehicle.model= car.models.find(model => model.carNumber === carId);
            if(vehicle.model !== {}){ 
            vehicle.brand=car.brand; 
            break; 
            }
        }
    return this.addCarToAgency(toAgencyId,vehicle) &&
    this.removeCarFromAgency(fromAgencyId,vehicle.model.carNumber); 
  }
};

const CustomerManager = {

  // Search for a customer by their name or ID.
  // @param {string} idOrName - ID or name of the customer
  // @return {object} - customer object if found, otherwise null
  searchCustomer: function (idOrName) {
    const customer = customers.find(customer => customer.id  === idOrName || customer.name === idOrName); 
    if(customer)
    return customer; 
    else return false; 
  },

  // Retrieve all customers' names.
  // @return {string[]} - Array of customer names
  getAllCustomers: function () {
    return customers.map(customer => customer.name); 
  },
  addCarToCustomer: function (car,customerId){ 
    const customer =customers.find(customer => customerId === customer.id);
    if(customer){
        customer.cars.push(car);
        return true;
}
return false; 
  }, 

  // Change the cash of a customer.
  // @param {string} customerId - The ID of the customer
  // @param {number} cash - The new cash value
  // @return {boolean} - true if updated successfully, false otherwise
  changeCustomerCash: function (customerId, cash) {
    const customer = customers.find(customer => customer.id === customerId); 
    if(customer){
        customer.cash+= cash;
        return true; 
    }
    return false; 
  },

  // Calculate the total value of all cars owned by a specific customer.
  // @param {string} customerId - The ID of the customer
  // @return {number} - The total value of cars owned by the customer
  getCustomerTotalCarValue: function (customerId) {
    const customer = customers.find(customer => customer.id === customerId); 
    return customer.cars.map(car => car.price).reduce((acc,current)=> acc+current, 0)
  },

};

const CarManager = {

  
  // Retrieve all cars available for purchase.
  // @return {object[]} - Array of cars
  getAllCars: function () {
    return agencies.map(agency => agency.cars);
  },

  // Search for cars based on certain criteria.
  // @param {number} year - The production year of the car
  // @param {number} price - The price of the car
  // @param {string} brand - The brand of the car
  // @return {object[]} - Array of cars that meet the criteria
  searchCars: function (year, price, brand) {
    let answer=[]; 
    const cars=  agencies.map(agency => agency.cars); 
    for (let car of cars)
        for(let carBrand of car)
            if(carBrand.brand === brand)
                for(let model of carBrand.models)
                    if(model.year === year && model.price === price)
                        answer.push(model); 
                
    return answer;
  },

  // Return the most expensive car available for sale.
  // @return {object} - The most expensive car
  getMostExpensiveCar: function () {
    let mostExpensive=0;  
    let vehicle; 
    const cars=  agencies.map(agency => agency.cars); 
    for (let car of cars)
        for(let carBrand of car)
                for(let model of carBrand.models)
                    if(model.price > mostExpensive){
                        mostExpensive=model.price; 
                        vehicle=model; 
                    }
                
    return vehicle;
  },
  

  // Return the cheapest car available for sale.
  // @return {object} - The cheapest car
  getCheapestCar: function () {
    let cheapest=99999999;  
    let vehicle; 
    const cars=  agencies.map(agency => agency.cars); 
    for (let car of cars)
        for(let carBrand of car)
                for(let model of carBrand.models)
                    if(model.price < cheapest){
                        cheapest=model.price; 
                        vehicle=model; 
                    }
                
    return vehicle;
  },
};

const CarPurchaseManager = {



  // Implement a sellCar function that sells a car to a specific customer.
  // @param {string} carId - The ID of the car
  // @param {string} customerId - The ID of the customer
  // @return {boolean} - true if the car was sold successfully, false otherwise
  sellCar: function (carId, customerId) {
    const car = CarAgencyManager.getCar(carId); 
    const customer =CustomerManager.searchCustomer(customerId); 
    if(car && customer){
        if(customer.cash >= car.price){
            CustomerManager.changeCustomerCash(customerId,-car.price); 
            CarAgencyManager.changeAgencyCashOrCredit(car.ownerId, car.price); 
            CustomerManager.addCarToCustomer(car,customerId);
            CarAgencyManager.removeCarFromAgency(car.ownerId,carId); 
            taxesAuthority.sumOfAllTransactions+= car.price; 
            taxesAuthority.numberOfTransactions+=1;
            CarAgencyManager.changeAgencyCashOrCredit(car.ownerId,-(car.price*0.17));
            taxesAuthority.totalTaxesPaid+=car.price*0.17; 
            return "transaction completed"; 
        }
        return "transaction failed"; 
    }

  },

  // Calculate and return the total revenue of the entire market.
  // @return {number} - The total revenue of the market
  getTotalMarketRevenue: function () {
    return taxesAuthority.sumOfAllTransactions; 
  },
};




// console.log(CarAgencyManager.addCarToAgency("Plyq5M5AZ", {
//     brand :"bmw",
//     model: { 
//     name: "5",
//     year: 2015,
//     price: 137000,
//     carNumber: "AZ4",
//     ownerId: "Plyq5M5AZ",
// }})); 
// console.log(CarAgencyManager.transferCarBetweenAgencies("26_IPfHU1","Plyq5M5AZ","ISMdU")); 
// console.log(CustomerManager.changeCustomerCash("BGzHhjnE8","45000")); 
// console.log(CarManager.searchCars(2015, 137000,"bmw"));
// console.log(CarAgencyManager.getCar("AZJZ4")); 
// console.log(CarPurchaseManager.sellCar("MWXBG","2RprZ1dbL")); 
// console.log(CarAgencyManager.searchAgency("Best Deal")); 
// console.log(CustomerManager.searchCustomer("2RprZ1dbL"))
// console.log(CarPurchaseManager.getTotalMarketRevenue());
