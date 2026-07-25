/* eslint-disable jsx-a11y/alt-text -- El <Image> de @react-pdf/renderer no es un <img> de
   HTML y no tiene prop alt: dibuja sobre el PDF. La regla no distingue entre ambos. */
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils/format';

/** Seis productos por pagina: la foto se ve sin hacer zoom en el celular del cliente. */
export const PRODUCTS_PER_PAGE = 6;

export interface CatalogDocumentProps {
  products: Product[];
  /** Imagenes ya descargadas, indexadas por id de producto. Las que fallaron no aparecen. */
  images: Map<number, string>;
  logo: string | null;
  whatsappNumber: string;
  generatedOn: string;
}

const COLORS = {
  brand: '#c2185b',
  ink: '#1f1220',
  muted: '#6b5c70',
  hairline: '#e6dbe9',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 42,
    paddingHorizontal: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.brand,
    paddingBottom: 10,
    marginBottom: 16,
  },
  logo: { width: 54, height: 54, objectFit: 'contain', marginRight: 12 },
  brandName: { fontSize: 19, fontFamily: 'Helvetica-Bold', color: COLORS.brand },
  brandTagline: { fontSize: 9, color: COLORS.muted, marginTop: 2 },
  headerRight: { marginLeft: 'auto', alignItems: 'flex-end' },
  headerRightLabel: { fontSize: 8, color: COLORS.muted },
  headerRightValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: COLORS.ink, marginTop: 2 },

  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  // Dos columnas por fila. El ancho deja un canal central sin usar margenes negativos.
  cell: { width: '50%', paddingHorizontal: 6, marginBottom: 14 },
  card: {
    borderWidth: 1,
    borderColor: COLORS.hairline,
    borderRadius: 6,
    padding: 8,
  },
  // 128pt es lo que cabe en tres filas de A4 con el encabezado. Con mas, cada pagina se
  // desbordaba a una segunda y el catalogo salia al doble de paginas.
  photo: { width: '100%', height: 128, objectFit: 'contain' },
  photoPlaceholder: {
    width: '100%',
    height: 128,
    backgroundColor: '#f6f1f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: { fontSize: 9, color: COLORS.muted },
  name: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.ink,
    marginTop: 8,
    // Dos lineas como maximo para que todas las tarjetas midan igual.
    maxLines: 2,
    textOverflow: 'ellipsis',
    minHeight: 28,
  },
  price: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: COLORS.brand, marginTop: 2 },

  footer: {
    position: 'absolute',
    bottom: 18,
    left: 30,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
    paddingTop: 8,
  },
  footerText: { fontSize: 9, color: COLORS.muted },
  footerStrong: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: COLORS.brand },
  pageNumber: { fontSize: 9, color: COLORS.muted, marginLeft: 'auto' },
});

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

export function CatalogDocument({
  products,
  images,
  logo,
  whatsappNumber,
  generatedOn,
}: CatalogDocumentProps) {
  const pages = chunk(products, PRODUCTS_PER_PAGE);

  return (
    <Document
      title="Catalogo Novedades LZ"
      author="Novedades LZ"
      subject="Catalogo de productos"
    >
      {pages.map((pageProducts, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={styles.header} fixed>
            {logo ? <Image src={logo} style={styles.logo} /> : null}
            <View>
              <Text style={styles.brandName}>NOVEDADES LZ</Text>
              <Text style={styles.brandTagline}>De todo para todos - Casa Grande</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.headerRightLabel}>Precios al</Text>
              <Text style={styles.headerRightValue}>{generatedOn}</Text>
            </View>
          </View>

          <View style={styles.grid}>
            {pageProducts.map((product) => {
              const image = images.get(product.id);

              return (
                <View key={product.id} style={styles.cell} wrap={false}>
                  <View style={styles.card}>
                    {image ? (
                      <Image src={image} style={styles.photo} />
                    ) : (
                      <View style={styles.photoPlaceholder}>
                        <Text style={styles.photoPlaceholderText}>Sin foto</Text>
                      </View>
                    )}
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.price}>{formatPrice(product.price, 'PEN')}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>Pedidos por WhatsApp </Text>
            <Text style={styles.footerStrong}>{whatsappNumber}</Text>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            />
          </View>
        </Page>
      ))}
    </Document>
  );
}
