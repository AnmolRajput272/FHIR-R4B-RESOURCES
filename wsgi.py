from flask import Flask, render_template
import service

app = Flask(__name__)

app.template_folder = "templates"
app.static_folder = "static"

@app.get("/hello")
def hello():
    return "hello"

@app.get("/")
def index():
    data = service.get_file_data(filename="resources_expanded_temp.json", convert_to_json=True)
    return render_template("index.html", data=data)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port="8000")