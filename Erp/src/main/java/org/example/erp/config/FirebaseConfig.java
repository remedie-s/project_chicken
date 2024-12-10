package org.example.erp.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {
    @PostConstruct
    public void initializeFirebase() throws IOException {
        // resources 폴더 아래에 위치한 파일 경로
        InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("serviceAccountKey.json");

        if (serviceAccount == null) {
            throw new FileNotFoundException("Firebase service account file not found in classpath.");
        }

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }
}
