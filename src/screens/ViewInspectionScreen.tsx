import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getInspection, getImagePublicUrl, Inspection } from '../services/inspectionService';

export default function ViewInspectionScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInspection();
  }, [id]);

  const loadInspection = async () => {
    try {
      setLoading(true);
      const data = await getInspection(id);
      setInspection(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a inspeção');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!inspection) {
    return (
      <View style={styles.centerContainer}>
        <Text>Inspeção não encontrada</Text>
      </View>
    );
  }

  const conditionColor = getConditionColor(inspection.condition);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.ropeType}>{inspection.rope_type}</Text>
          <View
            style={[
              styles.conditionBadge,
              { backgroundColor: conditionColor },
            ]}
          >
            <Text style={styles.conditionText}>{inspection.condition}</Text>
          </View>
        </View>
        <Text style={styles.date}>
          {new Date(inspection.created_at).toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>📍 Local</Text>
          <Text style={styles.infoValue}>{inspection.location}</Text>
        </View>

        {inspection.notes && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>📝 Observações</Text>
            <Text style={styles.infoValue}>{inspection.notes}</Text>
          </View>
        )}
      </View>

      {inspection.images && inspection.images.length > 0 && (
        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>Imagens ({inspection.images.length})</Text>
          <View style={styles.imagesGrid}>
            {inspection.images.map((imagePath, index) => {
              const imageUrl = getImagePublicUrl(imagePath);
              return (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={styles.image}
                />
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.detailsSection}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>ID</Text>
          <Text style={styles.detailValue}>{inspection.id}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Criada em</Text>
          <Text style={styles.detailValue}>
            {new Date(inspection.created_at).toLocaleString('pt-BR')}
          </Text>
        </View>
        {inspection.updated_at && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Atualizada em</Text>
            <Text style={styles.detailValue}>
              {new Date(inspection.updated_at).toLocaleString('pt-BR')}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function getConditionColor(condition: string): string {
  switch (condition) {
    case 'Excelente':
      return '#4CAF50';
    case 'Bom':
      return '#8BC34A';
    case 'Regular':
      return '#FFC107';
    case 'Crítico':
      return '#FF6B35';
    default:
      return '#999';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingVertical: 24,
    paddingHorizontal: 16,
    color: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ropeType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  conditionBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  conditionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  date: {
    color: '#bbb',
    fontSize: 12,
  },
  infoSection: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  imagesSection: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  image: {
    width: '48%',
    height: 150,
    borderRadius: 6,
  },
  detailsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
  },
});
