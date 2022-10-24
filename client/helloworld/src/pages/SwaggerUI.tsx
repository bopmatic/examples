import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './SwaggerUI.css';

const PageSwaggerUI: React.FC = () => {
    return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>SwaggerUI Test Page</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent fullscreen>
            <iframe src="apitest/index.html" title="SwaggerUI" className="swaggerUiPage" allowFullScreen></iframe>
          </IonContent>
        </IonPage>
    );
};

export default PageSwaggerUI;
