import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
}

interface PokemonDetail extends Pokemon {
  description: string;
  abilities: string[];
  stats: { name: string; base_stat: number }[];
  sprites: any;
}

export default function HomeScreen() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Función para obtener la lista de Pokémon
  const fetchPokemonList = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      
      const pokemonDetails = await Promise.all(
        data.results.map(async (poke: any) => {
          const detailResponse = await fetch(poke.url);
          const detail = await detailResponse.json();
          return {
            id: detail.id,
            name: detail.name,
            image: detail.sprites.other['official-artwork'].front_default,
            types: detail.types.map((type: any) => type.type.name),
            height: detail.height,
            weight: detail.weight,
          };
        })
      );
      
      setPokemon(pokemonDetails);
      setFilteredPokemon(pokemonDetails);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener detalles completos de un Pokémon
  const fetchPokemonDetails = async (id: number) => {
    try {
      setLoadingDetail(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      
      const description = speciesData.flavor_text_entries
        .find((entry: any) => entry.language.name === 'es' || entry.language.name === 'en')
        ?.flavor_text.replace(/\f/g, ' ') || 'Descripción no disponible';

      setSelectedPokemon({
        ...data,
        description,
        types: data.types.map((type: any) => type.type.name),
        abilities: data.abilities.map((ability: any) => ability.ability.name),
        stats: data.stats.map((stat: any) => ({
          name: stat.stat.name,
          base_stat: stat.base_stat
        })),
        image: data.sprites.other['official-artwork'].front_default,
        height: data.height,
        weight: data.weight,
      });
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Función para filtrar Pokémon
  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '') {
      setFilteredPokemon(pokemon);
    } else {
      const filtered = pokemon.filter(poke =>
        poke.name.toLowerCase().includes(text.toLowerCase()) ||
        poke.id.toString().includes(text)
      );
      setFilteredPokemon(filtered);
    }
  };

  // Función para obtener color según el tipo
  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    return colors[type] || '#68A090';
  };

  // Función para abrir el modal con detalles
  const openModal = async (pokemonId: number) => {
    setModalVisible(true);
    await fetchPokemonDetails(pokemonId);
  };

  useEffect(() => {
    fetchPokemonList();
  }, []);

  // Componente para renderizar cada Pokémon en la lista
  const PokemonCard = ({ item }: { item: Pokemon }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openModal(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.pokemonImage} />
      <View style={styles.cardContent}>
        <Text style={styles.pokemonId}>#{item.id.toString().padStart(3, '0')}</Text>
        <Text style={styles.pokemonName}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
        <View style={styles.typesContainer}>
          {item.types.map((type, index) => (
            <View
              key={index}
              style={[styles.typeTag, { backgroundColor: getTypeColor(type) }]}
            >
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#DC143C', dark: '#8B0000' }}
        headerImage={
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
              style={styles.pokeball}
            />
            <ActivityIndicator size="large" color="#fff" style={styles.loadingIndicator} />
          </View>
        }>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText type="title">Cargando Pokédex...</ThemedText>
          <ActivityIndicator size="large" color="#DC143C" style={{ marginTop: 20 }} />
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#DC143C', dark: '#8B0000' }}
        headerImage={
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
              style={styles.pokeball}
            />
            <ThemedText type="title" style={styles.headerTitle}>Pokédex</ThemedText>
          </View>
        }>
        
        <ThemedView style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar Pokémon por nombre o número..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
        </ThemedView>

        <ThemedView style={styles.statsContainer}>
          <ThemedText type="subtitle">
            Pokémon {searchText ? 'encontrados' : 'disponibles'}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.listContainer}>
          <FlatList
            data={filteredPokemon}
            renderItem={PokemonCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
        </ThemedView>
      </ParallaxScrollView>

      {/* Modal para detalles del Pokémon */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {loadingDetail ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color="#DC143C" />
                <Text style={styles.modalLoadingText}>Cargando detalles...</Text>
              </View>
            ) : selectedPokemon ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>

                <View style={styles.modalHeader}>
                  <Image
                    source={{ uri: selectedPokemon.sprites?.other?.['official-artwork']?.front_default }}
                    style={styles.modalPokemonImage}
                  />
                  <Text style={styles.modalPokemonName}>
                    {selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}
                  </Text>
                  <Text style={styles.modalPokemonId}>
                    #{selectedPokemon.id.toString().padStart(3, '0')}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Tipos</Text>
                  <View style={styles.typesContainer}>
                    {selectedPokemon.types?.map((type, index) => (
                      <View
                        key={index}
                        style={[styles.typeTag, { backgroundColor: getTypeColor(type) }]}
                      >
                        <Text style={styles.typeText}>{type}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Descripción</Text>
                  <Text style={styles.description}>{selectedPokemon.description}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Características</Text>
                  <View style={styles.characteristicsContainer}>
                    <Text style={styles.characteristic}>
                      Altura: {(selectedPokemon.height / 10).toFixed(1)} m
                    </Text>
                    <Text style={styles.characteristic}>
                      Peso: {(selectedPokemon.weight / 10).toFixed(1)} kg
                    </Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Habilidades</Text>
                  <View style={styles.abilitiesContainer}>
                    {selectedPokemon.abilities?.map((ability, index) => (
                      <Text key={index} style={styles.ability}>
                        • {ability.charAt(0).toUpperCase() + ability.slice(1)}
                      </Text>
                    ))}
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Estadísticas Base</Text>
                  {selectedPokemon.stats?.map((stat, index) => (
                    <View key={index} style={styles.statContainer}>
                      <Text style={styles.statName}>
                        {stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}:
                      </Text>
                      <View style={styles.statBarContainer}>
                        <View
                          style={[
                            styles.statBar,
                            { width: `${(stat.base_stat / 255) * 100}%` }
                          ]}
                        />
                        <Text style={styles.statValue}>{stat.base_stat}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const styles = StyleSheet.create({
  // Header styles
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pokeball: {
    width: 100,
    height: 100,
    opacity: 0.3,
  },
  headerTitle: {
    position: 'absolute',
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingIndicator: {
    position: 'absolute',
  },
  
  // Loading styles
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  
  // Search styles
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  
  // Stats styles
  statsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  
  // List styles
  listContainer: {
    paddingHorizontal: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  
  // Card styles
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pokemonImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  cardContent: {
    alignItems: 'center',
  },
  pokemonId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 2,
  },
  typeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalLoading: {
    alignItems: 'center',
    padding: 50,
  },
  modalLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalPokemonImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  modalPokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalPokemonId: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  characteristicsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  characteristic: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  abilitiesContainer: {
    marginLeft: 10,
  },
  ability: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  statContainer: {
    marginBottom: 10,
  },
  statName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 5,
  },
  statBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    height: 20,
    position: 'relative',
  },
  statBar: {
    backgroundColor: '#DC143C',
    height: '100%',
    borderRadius: 10,
    minWidth: 5,
  },
  statValue: {
    position: 'absolute',
    right: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});