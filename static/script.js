// const jsonData = {
//     "VirtualServiceDetail": {
//       "channelType": {
//         "object": {
//           "system": { "datatype": "uri" },
//           "version": { "datatype": "string" },
//           "code": { "datatype": "code" },
//           "display": { "datatype": "string" },
//           "userSelected": { "datatype": "boolean" }
//         },
//         "datatype": "Coding"
//       },
//       "addressUrl": { "datatype": "url" },
//       "addressString": { "datatype": "string" }
//     },
//     "VirtualServiceDetail2": {
//       "channelType": {
//         "object": {
//           "system": { "datatype": "uri" },
//           "version": { "datatype": "string" },
//           "code": { "datatype": "code" },
//           "display": { "datatype": "string" },
//           "userSelected": { "datatype": "boolean" }
//         },
//         "datatype": "Coding"
//       },
//       "addressUrl": { "datatype": "url" },
//       "addressString": { "datatype": "string" }
//     },
//     "temp" : {}
//   };

  const dataElement = document.getElementById('data-json');
  const jsonData = JSON.parse(dataElement.textContent);
  
  function createBlock(key, value, resource, field_till_here, isSubBlock = false) {

    // let resource_name = "";
    // if(!isSubBlock) resource_name = key;
    // else resource_name = resource;

    const block = document.createElement('div');
    block.className = isSubBlock ? 'sub-block' : 'block';
    block.classList.add(isSubBlock ? 'childblock' : 'parentblock');
  
    const keyElement = document.createElement('div');
    keyElement.className = 'key';
    keyElement.classList.add(isSubBlock ? 'childkey' : 'parentkey');

    const keyValueElement = document.createElement('div');
    keyValueElement.classList.add('keyValue')

    const dropdownIcon = document.createElement('span');
    dropdownIcon.classList.add('dropdown-icon', 'collapsed');
    dropdownIcon.innerHTML = '&#x25B6;'; // Unicode for right arrow

    const keyValueTextElement = document.createElement('a');
    keyValueTextElement.className = "keyValueText"
    keyValueTextElement.textContent = key;
    if(isSubBlock){
      keyValueTextElement.href = "https://www.hl7.org/fhir/r4b/"+resource+"-definitions.html"+"#"+field_till_here+"."+key;
    }
    else{
      keyValueTextElement.href = "https://www.hl7.org/fhir/r4b/"+resource+".html";
    }
    
    keyValueTextElement.target = "_blank";

    keyValueElement.appendChild(dropdownIcon);
    keyValueElement.appendChild(keyValueTextElement);

    const keyTypeElement = document.createElement('a');
    const meta_datatypes = ["ContactDetail","Contributor","DataRequirement","Expression","ParameterDefinition","RelatedArtifact","TriggerDefinition","UsageContext"]
    let datatype = value.datatype;
    if(datatype === "object") datatype = "BackboneElement";
    else if(datatype === "[object]") datatype = "[BackboneElement]";
    // keyTypeElement.textContent = datatype;

    const pattern = /(\[?)([\w\.]+)(\([^\)]*\))?(\]?)/g;

    datatype = datatype.replace(pattern, (match, p1, p2, p3, p4) => {
      let word = p2;
      let additional = p3 ? p3 : '';
      let base_url = "";
      if(word === "Reference"){
        base_url = "http://hl7.org/fhir/R4B/references.html"
      }
      else if(word == "BackboneElement"){
        base_url = "http://hl7.org/fhir/R4B/backboneelement.html"
      }
      else if(meta_datatypes.includes(word)){
        base_url = "http://hl7.org/fhir/R4B/metadatatypes.html"
      }
      else{
        base_url = "http://hl7.org/fhir/R4B/datatypes.html"
      }
      return (`<div> ${p1}
          <a href="${base_url}#${word}" target="_blank"
            style="text-decoration: none; color: inherit; cursor: pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
              ${word}
          </a>${additional} ${p4}
        </div>`);
    });

    keyTypeElement.innerHTML = datatype;

    keyElement.appendChild(keyValueElement);
    if(isSubBlock){
      keyElement.appendChild(keyTypeElement);
    }
    else{
        keyElement.classList.add("parent");
    }

    if(!("object" in value)){
      block.appendChild(keyElement);
      dropdownIcon.classList.remove("dropdown-icon");
      dropdownIcon.classList.add("finalblock");
      dropdownIcon.innerHTML = '&#x25A0;';
      keyElement.addEventListener('click', () => {
        block.classList.toggle('expanded');
        // dropdownIcon.classList.toggle('collapsed');
      });
      return block;
    }
    
    value = value.object;
    
    const valueElement = document.createElement('div');
    valueElement.className = 'value';
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      let next_field_till_here = field_till_here ? field_till_here+"."+key : key;
      for (const [subKey, subValue] of Object.entries(value)) {
        if(subKey === "datatype") continue;
        valueElement.appendChild(createBlock(subKey, subValue, resource, next_field_till_here, true));
      }
    } else {
      valueElement.textContent = JSON.stringify(value);
    }
  
    block.appendChild(keyElement);
    block.appendChild(valueElement);
  
    keyElement.addEventListener('click', () => {
      block.classList.toggle('expanded');
      dropdownIcon.classList.toggle('collapsed');
    });
  
    return block;
  }
  
  function renderJSON(json, container) {
    for (const [key, value] of Object.entries(json)) {
      container.appendChild(createBlock(key, value, key, ""));
    }
    const loader = document.getElementById("loader")
    loader.style.display = "none";
  }
  
  const container = document.getElementById('json-viewer');
  renderJSON(jsonData, container);