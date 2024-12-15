from flask import Flask, render_template, url_for, request

app = Flask(__name__)

# Home route
@app.route('/')
def home():
    projects = [
        {
            'img_src': url_for('static', filename='images/karl1.jpg'),
            'img_srcset': url_for('static', filename='images/karl1.jpg') + ' 1x, ' + url_for('static', filename='images/karl2.jpg') + ' 2x',
            'title': "Calculation of Karl Pearson's Coefficient of Correlation from Scratch",
            'url': url_for('karl_pearson'),
            'description': ("Calculating Karl Pearson's Coefficient of Correlation from scratch. "
                            "Understanding the step-by-step process enhances comprehension of the statistical "
                            "concepts involved in measuring the strength and direction of linear relationships "
                            "between variables."),
        },
        {
            'img_src': url_for('static', filename='images/Quora1.jpeg'),
            'img_srcset': url_for('static', filename='images/Quora1.jpeg') + ' 1x, ' + url_for('static', filename='images/Quora2.png') + ' 2x',
            'title': "Natural Language Processing and Correlation",
            'url': url_for('projects'),
            'description': "Exploring how NLP techniques can be used to implement Karl Pearson's Coefficient.",
        }
    ]
    return render_template('home.html', projects=projects)

# Projects route
@app.route('/projects', methods=['GET', 'POST'])
def projects():
    
    projects = [
        {
            'img_src': url_for('static', filename='images/karl1.jpg'),
            'img_srcset': url_for('static', filename='images/karl1.jpg') + ' 1x, ' + url_for('static', filename='images/karl2.jpg') + ' 2x',
            'title': "Calculation of Karl Pearson's Coefficient of Correlation from Scratch",
            'url': url_for('karl_pearson'),
            'description': ("Calculating Karl Pearson's Coefficient of Correlation from scratch. "
                            "Understanding the step-by-step process enhances comprehension of the statistical "
                            "concepts involved in measuring the strength and direction of linear relationships "
                            "between variables."),
        },
        {
            'img_src': url_for('static', filename='images/Quora1.jpeg'),
            'img_srcset': url_for('static', filename='images/Quora1.jpeg') + ' 1x, ' + url_for('static', filename='images/Quora2.png') + ' 2x',
            'title': "Natural Language Processing and Correlation",
            'url': url_for('projects'),
            'description': "Exploring how NLP techniques can be used to implement Karl Pearson's Coefficient.",
        }
    ]
    return render_template('projects.html', projects=projects)

# Route for Karl Pearson's Coefficient
@app.route('/karl_pearson')
def karl_pearson():
    return render_template('karl_pearson.html')

# Route to handle Karl Pearson form submission and calculation
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
    posts = [{
        "id": 1,
        "title": "Neural Network Back Propagation algorithms from scratch.",
        "date": "Aug 6, 2024",
        "author": "Vandan Patel",
        "description": (
            """Backpropagation is a fundamental supervised learning algorithm used to train artificial neural networks by minimizing prediction errors through iterative weight adjustments. It relies on the chain rule to calculate gradients, efficiently propagate errors backward through the network, and adjust weights to capture complex patterns in data. A practical Python implementation demonstrates forward propagation, parameter initialization, and weight updates ...."""
        ),
        "link": "https://medium.com/@vandan11patel/neural-network-back-propagation-algorithms-from-scratch-5ad32fd1b9e9"
    } 
    ]
    return render_template("blog.html", posts=posts)

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
