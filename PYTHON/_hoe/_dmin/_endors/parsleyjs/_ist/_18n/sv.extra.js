Stack(ref);
          for (const id of ids) {
            typeName = factory.createQualifiedName(typeName, id);
          }
          return factory.updateT