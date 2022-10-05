import React from 'react';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from '@ionic/react';
import './Home.css';

const PageHome: React.FC = () => {
  return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>Home</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Home</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                This is example website content that you can include with your bopmatic deployment. It includes static content and show how to invoke the service APIs you've defined in your Bopmatic.yaml.
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonPage>
    );
};

export default PageHome;
