import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllInspections, deleteInspection, Inspection } from '../services/inspectionService';

export default function HomeScreen({ navigation }: any) {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadInspections();
    }, [])
  );

  const loadInspections = async () => {
    try {
      setLoading(true);
      const data = await getAllInspections();
      setInspections(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as inspeções');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Deletar Inspeção',
      'Tem certeza que deseja deletar esta inspeção?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await deleteInspection(id);
              loadInspections();
              Alert.alert('Sucesso', 'Inspeção deletada com sucesso');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a inspeção');
            }
          },
        },
      ]
    );
  };

  const renderInspectionItem = ({ item }: { item: Inspection }) => (
    <TouchableOpacity
      style={styles.inspectionCard}
      onPress={() => navigation.navigate('ViewInspection', { id: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.ropeType}>{item.rope_type}</Text>
        <Text style={[styles.condition, { color: getConditionColor(item.condition) }]}>
          {item.condition}
        </Text>
      </View>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleDateString('pt-BR')}
      </Text>
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico de Inspeções</Text>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => navigation.navigate('NewInspection')}
        >
          <Text style={styles.newBtnText}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {inspections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma inspeção registrada</Text>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => navigation.navigate('NewInspection')}
          >
            <Text style={styles.createBtnText}>Criar Primeira Inspeção</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={inspections}
          renderItem={renderInspectionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
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
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  newBtn: {
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  newBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 12,
  },
  inspectionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ropeType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  condition: {
    fontSize: 14,
    fontWeight: '600',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    backgroundColor: '#FF6B35',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  createBtn: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  createBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
