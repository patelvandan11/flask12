from flask import Flask, render_template, url_for, request
import json

app = Flask(__name__)

 
@app.route('/')
def home():
     
    with open('data.json') as f:
        projects = json.load(f)
    return render_template('home.html', projects=projects)
 
@app.route('/projects', methods=['GET', 'POST'])
def projects():
    
    with open('data.json') as f:
        projects = json.load(f)
    return render_template('projects.html', projects=projects)

@app.route('/karl_pearson')
def karl_pearson():
    return render_template('karl_pearson.html')

@app.route('/karl_pearson_out', methods=['POST'])
def karl_pearson_out():
    try:
        # Input values from the form
        n = int(request.form['n'])
        x_values = [float(x) for x in request.form['x'].split(',')]
        y_values = [float(y) for y in request.form['y'].split(',')]

        # Basic validation
        if len(x_values) != n or len(y_values) != n:
            raise ValueError("The number of values does not match 'n'")

        # Summations required for the formula
        x_sum = sum(x_values)
        y_sum = sum(y_values)
        xy_sum = sum(x * y for x, y in zip(x_values, y_values))
        x_squared_sum = sum(x ** 2 for x in x_values)
        y_squared_sum = sum(y ** 2 for y in y_values)

        # Karl Pearson's coefficient formula
        numerator = n * xy_sum - x_sum * y_sum
        denominator = ((n * x_squared_sum - x_sum ** 2) * (n * y_squared_sum - y_sum ** 2)) ** 0.5

        # Avoid division by zero
        if denominator == 0:
            raise ZeroDivisionError("Denominator is zero, correlation cannot be calculated.")

        # Result
        result = numerator / denominator

        return render_template('karl_pearson_out.html', result=result)
    
    except Exception as e:
        error_message = str(e)
        return render_template('error.html', error_message=error_message)

# About route
@app.route('/about')
def about():
    return render_template("about.html")
    

# Contact route
@app.route('/contact')
def contact():
    return render_template('contact.html')

# blog route
@app.route('/blog')
def blog():
    with open('Blog.json') as f:
        posts = json.load(f)
    return render_template("blog.html", posts=posts)

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
