function ftechbyidwomen(id){
const shop = async () => {
  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchCategory" ,  id : id },
    success: function (response) {
      console.log("Raw Response:", response);
          console.log("Raw Response id:" , id);
          window.location.href = `category.html?cat_id=${22}`;
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    }
  });
};

shop();


}


function ftechbyidmen(id){
const shop = async () => {
  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchCategory" ,  id : id },
    success: function (response) {
      console.log("Raw Response:", response);
          console.log("Raw Response id:" , id);
          window.location.href = `category.html?cat_id=${1}`;
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    }
  });
};

shop();


}


function ftechbyidkids(id){
const shop = async () => {
  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchCategory" ,  id : id },
    success: function (response) {
      console.log("Raw Response:", response);
          console.log("Raw Response id:" , id);
          window.location.href = `category.html?cat_id=${4}`;
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    }
  });
};

shop();


}