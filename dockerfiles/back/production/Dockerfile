# base image  
FROM python:3.10   

# set work directory  
RUN mkdir /app

# where your code lives  
WORKDIR /app

# install dependencies  
RUN pip install --upgrade pip  
# run this command to install all dependencies  
COPY ./usArt_backend/requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt  

# copy whole project to your docker home directory. 
COPY ./usArt_backend/ /app

# port where the Django app runs  
EXPOSE 8000  
# start server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
