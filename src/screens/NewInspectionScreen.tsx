import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { createInspection, uploadImage } from '../services/inspectionService';

const ROPE_TYPES = ['Sintética', 'Natural', 'Aço', 'Mista'];
const CONDITIONS = ['Excelente', 'Bom', 'Regular', 'Crítico'];

export default function NewInspectionScreen({ navigation }: any) {
  const [ropeType, setRopeType] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [libraryPermission, setLibraryPermission] = useState<boolean | null>(null);

  React.useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraStatus.granted);

    const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setLibraryPermission(libraryStatus.granted);
  };

  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a galeria');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível acessar a câmera');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!ropeType || !condition || !location) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Create inspection first
      const inspection = await createInspection({
        rope_type: ropeType,
        condition,
        location,
        notes,
        images: [],
      });

      if (inspection && images.length > 0) {
        // Upload images if any
        const uploadedImages = [];
        for (const imageUri of images) {
          try {
            const imagePath = await uploadImage(imageUri, inspection.id);
            if (imagePath) {
              uploadedImages.push(imagePath);
            }
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      }

      Alert.alert('Sucesso', 'Inspeção criada com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a inspeção');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Tipo de Corda *</Text>
        <View style={styles.optionsContainer}>
          {ROPE_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.option,
                ropeType === type && styles.selectedOption,
              ]}
              onPress={() => setRopeType(type)}
            >
              <Text
                style={[
                  styles.optionText,
                  ropeType === type && styles.selectedOptionText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Condição *</Text>
        <View style={styles.optionsContainer}>
          {CONDITIONS.map((cond) => (
            <TouchableOpacity
              key={cond}
              style={[
                styles.option,
                condition === cond && styles.selectedOption,
              ]}
              onPress={() => setCondition(cond)}
            >
              <Text
                style={[
                  styles.optionText,
                  condition === cond && styles.selectedOptionText,
                ]}
              >
                {cond}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Local *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Setor A, Equipamento 1"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Notas adicionais sobre a inspeção"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Imagens ({images.length})</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={takePhoto}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>📷 Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={pickImageFromLibrary}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>🖼️ Galeria</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imagesGrid}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageBtn}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Salvar Inspeção</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  optionText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2c3e50',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  imageWrapper: {
    position: 'relative',
    width: '48%',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 6,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
