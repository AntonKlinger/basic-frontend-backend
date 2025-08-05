1. Backend erstellen
    python -m django startproject backend
    cd backend
    python manage.py startapp api

2. In settings.py:

    INSTALLED_APPS = [
        ...
        'rest_framework',     # <- hinzufügen
        'corsheaders',        # für CORS
        'api',                # dein App-Name
    ]

    MIDDLEWARE = [
        'corsheaders.middleware.CorsMiddleware',  # ganz oben einfügen
        ...
    ]

    # Erlaube alle Domains für Entwicklung (vorsichtig bei Produktion!)
    CORS_ALLOW_ALL_ORIGINS = True

3. 

    pip install djangorestframework django-cors-headers

4. in api/models.py

    from django.db import models

    class Nachricht(models.Model):
        inhalt = models.TextField()
        erstellt_am = models.DateTimeField(auto_now_add=True)

5. api/seralizers.py ertellen und ... einfügen

    from rest_framework import serializers
    from .models import Nachricht

    class NachrichtSerializer(serializers.ModelSerializer):
        class Meta:
            model = Nachricht
            fields = '__all__'

6. api/urls.py

    from rest_framework.routers import DefaultRouter
    from .views import NachrichtViewSet
    from django.urls import path, include

    router = DefaultRouter()
    router.register(r'nachrichten', NachrichtViewSet)

    urlpatterns = [
        path('', include(router.urls)),
    ]

7. in backend/urls.py

    from django.contrib import admin
    from django.urls import path, include

    urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('api.urls')),
    ]

8. 

    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver

9. kann unter http://127.0.0.1:8000/api/nachrichten/ abgerufen werden








React Frontend erstellen:

1. cd ..

2. 

    npx create-react-app frontend
    cd frontend

3. 

    npm install axios

4. in app.js

    import React, { useEffect, useState } from 'react';
    import axios from 'axios';

    function App() {
    const [nachrichten, setNachrichten] = useState([]);
    const [inhalt, setInhalt] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/nachrichten/')
        .then(res => setNachrichten(res.data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:8000/api/nachrichten/', { inhalt })
        .then(res => setNachrichten([res.data, ...nachrichten]));
        setInhalt('');
    };

    return (
        <div style={{ padding: '2rem' }}>
        <h1>Nachrichten</h1>
        <form onSubmit={handleSubmit}>
            <textarea
            value={inhalt}
            onChange={(e) => setInhalt(e.target.value)}
            />
            <br />
            <button type="submit">Absenden</button>
        </form>

        <hr />

        <ul>
            {nachrichten.map((n) => (
            <li key={n.id}>
                <strong>{new Date(n.erstellt_am).toLocaleString()}</strong><br />
                {n.inhalt}
            </li>
            ))}
        </ul>
        </div>
    );
    }

    export default App;

5.

    npm start