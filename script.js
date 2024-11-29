const candyForm = document.getElementById('candy-form');
const candyList = document.getElementById('candy-list');

// Base URL for the API
const API_URL = 'https://crudcrud.com/api/3287bff101134be4aff16309074275ab/PostCandy';

// Event listener for form submission
candyForm.addEventListener('submit', addCandy);

// Fetch candies from the API and display them
async function fetchCandies() {
  let candies;
  try{
  const response = await fetch(API_URL);
  candies = await response.json();
  }catch{
    console.log("failed to fetch")
  }
  debugger
  displayCandies(candies);
}

// Function to display candies in the table
function displayCandies(candies) {
  candyList.innerHTML = '';
  candies?.forEach((candy) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${candy.CandyName}</td>
      <td>${candy.Description}</td>
      <td>${candy.Price}</td>
      <td>${candy.Quantity}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="buyCandy('${candy._id}', 1)">Buy 1</button>
        <button class="btn btn-success btn-sm" onclick="buyCandy('${candy._id}', 2)">Buy 2</button>
        <button class="btn btn-info btn-sm" onclick="buyCandy('${candy._id}', 3)">Buy 3</button>
      </td>
    `;
    candyList.appendChild(row);
  });
}

// Function to add a new candy
async function addCandy(e) {
  e.preventDefault();

  const CandyName = document.getElementById('name').value;
  const Description = document.getElementById('description').value;
  const Price = document.getElementById('price').value;
  const Quantity = parseInt(document.getElementById('quantity').value);

  const newCandy = { CandyName, Description, Price, Quantity };
  debugger

  await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCandy),
  }).then(res=>{
    if(res.ok){
      candyForm.reset();
      fetchCandies();
    }
    console.log(res)
  }).catch(err=>alert(err))

  
}

// Function to buy candy and update quantity
async function buyCandy(id, quantityToBuy) {


 
  let candy;
  try {
    const response = await fetch(`${API_URL}/${id}`);
    candy = await response.json();
  }
  catch{
    alert('Something went wrong')
  }
  if (candy.Quantity >= quantityToBuy) {
    const updatedCandy = {...candy, Quantity: candy.Quantity - quantityToBuy };
    delete updatedCandy._id; 

    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCandy),
    }).then(res=> {
      if(res.ok){
        fetchCandies();
      }
      console.log(res)}

    ).catch(err=> alert(err))

    
  } else {
    alert('Not enough quantity available');
  }
}

// Initial fetch of candies when the page loads
fetchCandies();
