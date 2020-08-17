import customersdb,{bulkcreate,getData,createEle} from './module.js';

let db = customersdb("Customersdb",{
    customers:'++id,name,lastname,dni,phone'
});

//inputs tags
const id = document.getElementById("id");
const name = document.getElementById("name");
const lastname = document.getElementById("lastname");
const dni = document.getElementById("dni");
const phone = document.getElementById("phone");

//buttons
const btncreate = document.getElementById("btn-create");
const btnupdate = document.getElementById("btn-update");
const btnread = document.getElementById("btn-read");
const btndeleteall = document.getElementById("btn-delete-all");

// insert value using create button
btncreate.onclick = (event)=>{
    let flag = bulkcreate(db.customers,{
        name:name.value,
        lastname:lastname.value,
        dni:dni.value,
        phone:phone.value
    })
    console.log(flag);

    name.value = lastname.value = dni.value = phone.value = '';

    getData(db.customers,(data)=>{
        console.log(data);
        id.value = data.id +1 || 1;
    });
}

// create event on btnread button

btnread.onclick = table;

//update event
btnupdate.onclick = ()=>{
    const id3 = parseInt(id.value||0);
    if(id3){
        db.customers.update(id3,{
            name:name.value,
            lastname:lastname.value,
            dni:dni.value,
            phone:phone.value
        }).then((updated)=>{
            let get = updated?'data updated':'data not updated';
            console.log(get);
        })
    }
}

function table(){
    const tbody = document.getElementById("tbody");

    while(tbody.hasChildNodes()){
        tbody.removeChild(tbody.firstChild);
    }

    getData(db.customers,(data)=>{
        if(data){
            createEle("tr",tbody,tr =>{

                for (const value in data) {
                    
                    createEle("td",tr,td =>{
                        // td.textContent = data.name === data[value]?'si':data[value];
                        td.textContent = data[value];

                    })       
                }
                createEle("td",tr,td =>{
                    createEle("i",td,i=>{
                        i.className += "fas fa-edit btnedit";
                        i.setAttribute('data-id',data.id);
                        i.onclick = editbtn;
                    })
                })
                createEle("td",tr,td =>{
                    createEle("i",td,i=>{
                        i.className += "fas fa-trash-alt btndelete";
                        i.setAttribute('data-id',data.id);
                        i.onclick = deletebtn;
                    })
                })
            })
        }
    })
}

//delete records
btndeleteall.onclick = ()=>{
    db.delete();
    db = customersdb("Customersdb",{
        customers:'++id,name,lastname,dni,phone'
    });
    db.open;
    table();
}

function editbtn(event){
    let id2 = parseInt(event.target.dataset.id);
    db.customers.get(id2,data =>{
        name.value = data.name || '';
        lastname.value = data.lastname || '';
        dni.value = data.dni || '';
        phone.value = data.phone || '';
        id.value = id2;
    })
}

function deletebtn(event){
    let id2 = parseInt(event.target.dataset.id);
    db.customers.delete(id2);
    table();
}