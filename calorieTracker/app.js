//Storage Controller
const storageCtrl= (function()
{
    //publuc methods
    return{
        storeItem: function(item)
        {
            let items;
            //check for existing items in local storage
            if(localStorage.getItem('items')===null)
            {
                items=[];
                items.push(item);
                
                //set local storage
                localStorage.setItem('items',JSON.stringify(items));
            }
            else
            {
                //pull out whats in local storage to an array of objs
                items= JSON.parse(localStorage.getItem('items'));

                //push new item
                items.push(item);

                //reset local storage covert back kinto string and put to local storage
                //nb local storage can only accept strings
                localStorage.setItem('items', JSON.stringify(items));
            }
            
        },

        getItemsFromStorage: function()
        {
            let items;

            if(localStorage.getItem('items')===null)
            {
                items=[];
            }
            else
            {
                items= JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },

        updateItemStorage:function(updatedItem)
        {
            let items= JSON.parse(localStorage.getItem('items'));
            items.forEach((item,index)=>
            {
                if(updatedItem.id=== item.id)
                {
                    items.splice(index,1,updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

       deleteItemStorage: function(deleteID)
        {
            let items= JSON.parse(localStorage.getItem('items'));
            items.forEach((item,index)=>
            {
                if(deleteID=== item.id)
                {
                    items.splice(index,1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        clearAllFromStorage: function()
        {
            localStorage.removeItem('items');
        }

    }

    
})();


//Item Controller
//using standard module pattern
    const itemCtrl= (()=>
    {
        //item constructor
        const Item= function(id,name,calories)
        {
            this.id=id;
            this.name=name;
            this.calories=calories;
        }

        //data structure/ state
        const data= {
            items: storageCtrl.getItemsFromStorage(),
            currentItem:null,
            totalCalories:0
        }
        //public methods
        return{
            getItems: function()
            {
                return data.items;
            },
            addItem: function(name, calories)
            {
                if(data.items.length>0)
                {
                    ID= data.items[data.items.length -1].id + 1;
                }
                else
                {
                    ID=0;
                }
                
                //calories string to number
                calories= parseInt(calories);

                //create new item
                newItem = new Item(ID,name,calories);
                //add item to array
                data.items.push(newItem);
                
                return newItem;
            },

            deleteItem: function(id)
            {
                //get IDs
                const IDs= data.items.map(item => 
                {
                    return item.id;
                });

                //get index
                const index = IDs.indexOf(id);

                //remove item
                data.items.splice(index,1);
            },

            getItemById: function(id)
            {
                let found=null;

                //loop thru items
                data.items.forEach(item =>
                    {
                        if(item.id===id)
                        {
                            found=item;
                        }
                    });
                    return found;
            },

            setCurrentItem: function(item)
            {
                data.currentItem=item;
            },

            getCurrentItem: function()
            {
                return data.currentItem;
            },

            updateItem: function(name,calories)
            {
                calories= parseInt(calories);
                let found=null;

                //loop thru items
                data.items.forEach(item =>
                    {
                        if(item.id=== data.currentItem.id)
                        {
                            item.name=name;
                            item.calories=calories;
                            found=item;
                        }
                    });

                    return found;
            },

            getTotalCalories:function()
            {
                let total=0;
                //loop through to get add calories
                data.items.forEach((item) =>
                {
                    total+=item.calories;
                });
                data.totalCalories=total;

                return data.totalCalories;
            },

            clearAllItems: function()
            {
                data.items=[];
            },

            logData: function()
            {
                return data;
            }
        }
    })();

// UI Controller
    // utilization of iife : immediately invoked function expression
    const uiCtrl= (function()
    {
        const uiSelectors= {
            itemList:'#item-list',
            listItems:'#item-list li',
            addBtn:'.add-btn',
            itemNameInput:'#itemName',
            itemCaloriesInput:'#itemCal',
            total_calories:'.totalCalories',
            updateBtn:'.update-btn',
            deleteBtn:'.delete-btn',
            backBtn:'.back-btn',
            clearBtn:'.clear-btn'
        }
        //public methods
        return{
            populateItemsList: function(items)
            {
                let html='';

                items.forEach((item)=>
                {
                    html+=`<li id="item-${item.id}" class="collection-item">
                    <strong>${item.name}:</strong> <em> ${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                </li>`;
                });

                let ul = document.querySelector(uiSelectors.itemList);
                ul.innerHTML=html;
            },

            getItemInput: function()
            {
                return{
                    foodName:document.querySelector(uiSelectors.itemNameInput).value,
                    calories:document.querySelector(uiSelectors.itemCaloriesInput).value
                }
            },

            addListItem: function(item)
            {
                //make ul visible
                document.querySelector(uiSelectors.itemList).style.display='block';
                //create li
                const li= document.createElement('li');
                //add class
                li.className= 'collection-item';
                //add id
                li.id = `item-${item.id}`;

                //add html
                li.innerHTML= `<strong>${item.name}:</strong> <em> ${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
               //insert item 
                document.querySelector(uiSelectors.itemList).insertAdjacentElement('beforeend',li);
            },

            updateList: function(updatedItem)
            {
                let listItems= document.querySelectorAll(uiSelectors.listItems);

                //conert node list to array
                listItems= Array.from(listItems);
                
                //loop thru nodes
                listItems.forEach(listItem =>
                    {
                        const itemID= listItem.getAttribute('id');

                        if(itemID===`item-${updatedItem.id}`)
                        {
                            document.querySelector(`#${itemID}`).innerHTML=`<strong>${updatedItem.name}:</strong> <em> ${updatedItem.calories} Calories</em>
                            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                        }
                    });

            },

            clearInput: function()
            {
                document.querySelector(uiSelectors.itemNameInput).value='';
                document.querySelector(uiSelectors.itemCaloriesInput).value='';
            },

            addItemtoForm: function()
            {
                document.querySelector(uiSelectors.itemNameInput).value=itemCtrl.getCurrentItem().name;
                document.querySelector(uiSelectors.itemCaloriesInput).value=itemCtrl.getCurrentItem().calories;

                uiCtrl.showEditState();
            },

            hideList: function()
            {
                document.querySelector(uiSelectors.itemList).style.display='none';
            },

            showTotalCalories: function(total_calories)
            {
                document.querySelector(uiSelectors.total_calories).textContent= total_calories;
            },
            
            clearEditState: function()
            {
                uiCtrl.clearInput();
                document.querySelector(uiSelectors.updateBtn).style.display='none';
                document.querySelector(uiSelectors.deleteBtn).style.display='none';
                document.querySelector(uiSelectors.backBtn).style.display='none';
                document.querySelector(uiSelectors.addBtn).style.display='inline';
                
            },

            showEditState: function()
            {
                document.querySelector(uiSelectors.updateBtn).style.display='inline';
                document.querySelector(uiSelectors.deleteBtn).style.display='inline';
                document.querySelector(uiSelectors.backBtn).style.display='inline';
                document.querySelector(uiSelectors.addBtn).style.display='none';
            },

            deleteFromUI: function(currentID)
            {
                const itemID= `#item-${currentID}`;
                const item= document.querySelector(itemID);
                item.remove();
            },

            clearAllUI: function()
            {
                let listItems= document.querySelectorAll(uiSelectors.listItems);

                //turn node list into array

                listItems= Array.from(listItems);

                listItems.forEach(item =>
                    {
                        item.remove();
                    });
            },

            getSelectors: function(){
                return uiSelectors;
            }
        }
    })();


//App Controller

    const app= (function(itemCtrl,storageCtrl,uiCtrl){
        const loadEventListeners= function()
        {
            //get UI Selectors
            const uiSelectors= uiCtrl.getSelectors();
            
            //Add item event
            document.querySelector(uiSelectors.addBtn).addEventListener('click',addItem);

            //disable enter as form of submit 
            document.addEventListener('keypress',function(e)
            {
                if(e.keyCode===13 || e.which===13)
                {
                    e.preventDefault();
                    return false;
                }
            });
            //edit icon click event
            document.querySelector(uiSelectors.itemList).addEventListener('click',CLICKupdateItem);

            //update Item event
            document.querySelector(uiSelectors.updateBtn).addEventListener('click',updateItemSubmit);
            
            //delete Item event
            document.querySelector(uiSelectors.deleteBtn).addEventListener('click',deleteItemSubmit);
           
            //back button event
           // document.querySelector(uiSelectors.backBtn).addEventListener('click', uiCtrl.clearEditState);
            document.querySelector(uiSelectors.backBtn).addEventListener('click', backFunction);

            //clear all event listener
            document.querySelector(uiSelectors.clearBtn).addEventListener('click',CLICKclearAll);
        }

        const backFunction= function(e)
        {
            uiCtrl.clearEditState();

            e.preventDefault();
        }
        //Add Item  submit
        const addItem=function(event)
        {
            //get form input
            const input= uiCtrl.getItemInput();
           //check for form input
            if (input.foodName != '' && input.calories != '')
            {
                // add item 
               const newItem= itemCtrl.addItem(input.foodName, input.calories);

               //add to UI
               uiCtrl.addListItem(newItem);

               //get total calories
               const total_calories= itemCtrl.getTotalCalories();

               //add calories to ui
               uiCtrl.showTotalCalories(total_calories);

               //add to local storage
               storageCtrl.storeItem(newItem);

               //clear fields in form
               uiCtrl.clearInput();
            }
            event.preventDefault();
        }
        //click event functionality Update Item 
        const CLICKupdateItem= function(e)
        {
            //using event deligation becuz pencil added dynamically
            if(e.target.classList.contains('edit-item'))
            {
                //get list item id
                const listID= e.target.parentNode.parentNode.id;
                
                //split array

                const ItemNumArray= listID.split('-');
                //get actual id number
                const ItemID=parseInt(ItemNumArray[1]);

                //get item
                const itemToEdit= itemCtrl.getItemById(ItemID);
                
                //set current item
                itemCtrl.setCurrentItem(itemToEdit);

                //Add item to form for edit
                uiCtrl.addItemtoForm();
            }
            e.preventDefault();
        }

        //update item submit
        const updateItemSubmit= function(e)
        {
            //get Item input
            const input= uiCtrl.getItemInput();
           
            //update item
            const updatedItem= itemCtrl.updateItem(input.foodName ,input.calories);

            //updateUI
            uiCtrl.updateList(updatedItem);

            //get total calories
            const total_calories= itemCtrl.getTotalCalories();

            //add calories to ui
            uiCtrl.showTotalCalories(total_calories);

            //update local storage
            storageCtrl.updateItemStorage(updatedItem);

            //clear form
            uiCtrl.clearEditState();

            e.preventDefault();
        }

        //delete event
        const deleteItemSubmit= function(event)
        {
            //get current item
            const currentItem= itemCtrl.getCurrentItem();

            //delete from data structure
            itemCtrl.deleteItem(currentItem.id);

            //delete from UI
            uiCtrl.deleteFromUI(currentItem.id);
            
            //get total calories
            const total_calories= itemCtrl.getTotalCalories();

            //add calories to ui
            uiCtrl.showTotalCalories(total_calories);

            //delete from local storage
            storageCtrl.deleteItemStorage(currentItem.id)

            uiCtrl.clearEditState();

            

            event.preventDefault();
            
        }

        const CLICKclearAll= function()
        {
            //delete all items from data structor
            itemCtrl.clearAllItems();

            //get total calories
            const total_calories= itemCtrl.getTotalCalories();

            //add calories to ui
            uiCtrl.showTotalCalories(total_calories);

            //clear form local storage
            storageCtrl.clearAllFromStorage();

            //remove from ui
            uiCtrl.clearAllUI();

            //hide ul
            uiCtrl.hideList();

        }


        //public methods
        return{
            initialize: function()
            {
                //set initial state
                uiCtrl.clearEditState();
                //get items from data structure
                const items= itemCtrl.getItems();

                //check if ul is empty
                if(items.length===0)
                {
                    uiCtrl.hideList();
                }
                else
                {
                    //populate list with items
                uiCtrl.populateItemsList(items);
                }
                
                //get total calories
               const total_calories= itemCtrl.getTotalCalories();

               //add calories to ui
               uiCtrl.showTotalCalories(total_calories);

                loadEventListeners();

            }
        }
    })(itemCtrl,storageCtrl,uiCtrl);

    app.initialize();