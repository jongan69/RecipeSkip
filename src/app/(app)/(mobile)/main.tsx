import React, { useEffect, useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import {
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Clarifai from 'clarifai';

const CLARIFAI_API_KEY = '2ede759d9aa146219242ba954fc1813b';

export default function App() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [photo, setPhoto] = useState(null);
    const [predictions, setPredictions] = useState(null);

    const clarifaiApp = new Clarifai.App({
        apiKey: CLARIFAI_API_KEY,
    });

    useEffect(() => {
        const getPermissionAsync = async () => {
            if (Platform.OS !== 'web') {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        };
        getPermissionAsync();
    }, []);

    const clarifaiDetectObjectsAsync = async (source) => {
        try {
            const newPredictions = await clarifaiApp.models.predict(
                { id: Clarifai.FOOD_MODEL },
                { base64: source },
                { maxConcepts: 10, minValue: 0.4 }
            );
            setPredictions(newPredictions.outputs[0].data.concepts);
        } catch (error) {
            console.log('Exception Error: ', error);
        }
    };

    const takePicture = async () => {
        console.log(photo.uri);
        if (cameraRef) {
            const takenPhoto = await cameraRef.takePictureAsync({ base64: true });
            setPhoto(takenPhoto);
            console.log(photo.uri);
            await clarifaiDetectObjectsAsync(takenPhoto.base64);
        }
    };

    const pickImage = async () => {
        try {
            let response = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (!response.cancelled) {
                const manipResponse = await ImageManipulator.manipulateAsync(
                    response.uri,
                    [{ resize: { width: 900 } }],
                    {
                        compress: 1,
                        format: ImageManipulator.SaveFormat.JPEG,
                        base64: true,
                    }
                );

                setPhoto({ uri: manipResponse.uri });
                await clarifaiDetectObjectsAsync(manipResponse.base64);
            }
        } catch (error) {
            console.log(error);
        }
    };

    function toggleCameraType() {
        setType((current) =>
            current === CameraType.back ? CameraType.front : CameraType.back
        );
    }

    let cameraRef;

    return (
        <>
            <Camera
                ref={(ref) => {
                    cameraRef = ref;
                }}
                style={styles.camera}
                type={type}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.text}>Take Picture</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.text}>Pick Image</Text>
                    </TouchableOpacity>
                </View>
            </Camera>
            {photo && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: photo.uri }} style={styles.image} />
                </View>
            )}
            <View style={styles.predictionWrapper}>
                {predictions &&
                    predictions.map((p, index) => (
                        <Text key={index} style={styles.text}>
                            {p.name}: {parseFloat(p.value).toFixed(3)}
                        </Text>
                    ))}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        height: '100%',
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    button: {
        backgroundColor: 'rgba(0, 122, 255, 0.7)',
        padding: 15,
        borderRadius: 5,
    },
    text: {
        fontSize: 18,
        color: 'black',
    },
    imageContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    predictionWrapper: {
        alignItems: 'center',
        marginTop: 20,
    },
});
