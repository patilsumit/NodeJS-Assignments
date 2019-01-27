/* Title: Test code to use the CRUD functions from data lib
 *
 */

// Dependencies
var fops = require('./lib/data');
const readline = require('readline');
var Lazy=require("lazy");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var user = {
    "phone": "",
    "name": "",
    "email": "",
    "dob": ""
};

function createConsole() {
    console.log("******CRUD Operation For User******");
    console.log("1. Create User");
    console.log("2. Read User");
    console.log("3. Update User");
    console.log("4. Delete User");
    console.log("5. List All Users");
    console.log("6. Advanced Search");
    console.log("0. Exit");

    rl.question('Enter Choice\n', (answer) => {
        // TODO: Log the answer in a database


        if (answer == '1') {
            createData();
        }
        else if (answer == '2') {
            readData();
        }
        else if (answer == '3') {
            updataData();
        }
        else if(answer == '4'){
            deleteData();
        }
        else if(answer == '5'){

            listAllUsers();
        }
        //rl.close();
    });

}
// Invoke the functions from data lib
createConsole();

function createData() {

    console.log("Enter User Details");

    rl.question('phone', (answer) => {
        // TODO: Log the answer in a database
        // console.log(`Phone: ${answer}`);
        user.phone = answer;

        //rl.close();

        rl.question('name', (answer) => {
            // TODO: Log the answer in a database
            // console.log(`Name: ${answer}`);
            user.name = answer;
            //  rl.close();
            rl.question('email', (answer) => {
                // TODO: Log the answer in a database
                // console.log(`Email: ${answer}`);
                user.email = answer;

                //    rl.close();

                rl.question('dob', (answer) => {
                    // TODO: Log the answer in a database
                    // console.log(`Dob: ${answer}`);
                    user.dob = answer;

                    // // Create the user
                    fops.create('users', user.phone, user, function (err) {
                        if (err) {
                            console.log("ERROR: Could not create user", err);
                        }
                        else {
                            console.log("SUCESS: Saved user to file");
                        }
                    });
                    rl.close();
                });
            });
        });

    });
}

function readData() {

    // Read the user
    console.log('Read User');
    rl.question('phone', (answer) => {
        // TODO: Log the answer in a database
        // console.log(`Phone: ${answer}`);
        user.phone = answer;

        var newObj = {};

        fops.read('users', user.phone, function (err, newObj) {
            if (!err && newObj) { // Read is successful
                console.log("Read User: ", newObj);
            }
            else { // Error in reading
                console.log("ERROR: Could not read user", err);
            }
            rl.close();
        });
    });


}


function updataData() {
    // Update the user
    //You can specify the properties to be updated by creating a new object
    var userChanges = {};
    console.log("Update User");
    rl.question('phone', (answer) => {
        fops.read('users', answer, function (err, newObj) {
            if (!err && newObj) { // Read is successful
                console.log("Read User: ", newObj);

                rl.question('Update Name', (answer) => {
                    userChanges.name = answer

                    rl.question('Update Email', (answer) => {
                        userChanges.email = answer

                        rl.question('Update Dob', (answer) => {
                            userChanges.dob = answer

                            var origUser = newObj;

                            if (userChanges.phone) { //phone number cannot be changed
                                console.log("Cannot update phone");
                            }
                            else {
                                var name = typeof (userChanges.name) == "string" ? userChanges.name : false;
                                var email = typeof (userChanges.email) == "string" ? userChanges.email : false;
                                var dob = typeof (userChanges.dob) == "string" ? userChanges.dob : false;

                                if (name || email || dob) {
                                    // Create a new updated object
                                    if (name) {
                                        origUser.name = name;
                                    }
                                    if (email) {
                                        origUser.email = email;
                                    }
                                    if (dob) {
                                        origUser.dob = dob;
                                    }
                                    console.log("Update user:", origUser);

                                    //Update the object to the file
                                    fops.update('users', origUser.phone, origUser, function (err) {
                                        if (err) {
                                            console.log("Error In updating", err);
                                        }
                                        else {
                                            console.log("Sucess: Updated user to file");
                                        }
                                    });
                                }
                                else {
                                    console.log("Atleast one property must be set");
                                }
                            }

                        });
                    });
                });
                // @TODO: Get the user from file, and invoke it in callback for read
            }
            else { // Error in reading
                console.log("ERROR: Could not read user", err);
            }

        });
    });

}

function deleteData() {
    rl.question('phone', (answer) => {

        //Delete the user
         fops.delete('users', answer, function(err){
            if(err){
                console.log("Deletion failed");
            }
            else {
                console.log(answer + "User Succesfully Deleted");
            }
         });
    });
}

function listAllUsers(){   
    
    
    console.log('Read User');

        var newObj = {};

        fops.listAll('./users/', function (err, files) {
            if (!err && files) { // Read is successful
                console.log("Read User: ", files);
                var num=files.split('.');
                console.log(num);
                var newObj={};
                fops.read('users',num[0],function(err,newObj){
                    if(!err && newObj){
                     console.log("Read  User:",newObj);
                    }
                    else { // Error in reading
                        console.log("ERROR: Could not read user", err);
                    }
                })
            }
            
            rl.close();
        });
    
        

}
