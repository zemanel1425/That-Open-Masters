

/* iterate over a list
type JsonObject = Record<string, any>;

const jsonObject: JsonObject = {
  name: "John",
  age: 30,
  city: "New York"
};

// Extract keys
const keys = Object.keys(jsonObject);
console.log("Keys:", keys);

// Extract values
const values = Object.values(jsonObject);
console.log("Values:", values);

// Extract key-value pairs
const entries = Object.entries(jsonObject);
console.log("Entries:", entries);

// Iterate through key-value pairs
entries.forEach(([key, value]) => {
  console.log(`Key: ${key}, Value: ${value}`);
});


function extractKeysAndValues(obj: JsonObject): void {
  for (const [key, value] of Object.entries(obj)) {
    console.log(`Key: ${key}`);
    if (typeof value === "object" && value !== null) {
      extractKeysAndValues(value); // Recursively handle nested objects
    } else {
      console.log(`Value: ${value}`);
    }
  }
}

const nestedJson = {
  name: "John",
  details: {
    age: 30,
    city: "New York"
  }
};

extractKeysAndValues(nestedJson);

const details = nestedJson.details;
console.log(details); // { age: 30, city: "New York" }

const lastKey = Object.keys(nestedJson)[Object.keys(nestedJson).length - 1];
const lastItem = nestedJson[lastKey];

console.log('Last key:', lastKey); // details
console.log('Last item:', lastItem); // { age: 30, city: "New York" }

const lastKey = Object.keys(nestedJson)[Object.keys(nestedJson).length - 1];
const lastItem = nestedJson[lastKey];

console.log('Last key:', lastKey); // details
console.log('Last item:', lastItem); // { age: 30, city: "New York" }
*/







