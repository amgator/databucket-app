package pl.databucket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.databucket.entity.DataClass;
import pl.databucket.exception.*;
import pl.databucket.dto.DataColumnsDto;
import pl.databucket.entity.DataColumns;
import pl.databucket.repository.DataClassRepository;
import pl.databucket.repository.DataColumnsRepository;

import java.util.List;


@Service
public class DataColumnsService {

    @Autowired
    private DataColumnsRepository columnsRepository;

    @Autowired
    private DataClassRepository dataClassRepository;

    public DataColumns createColumns(DataColumnsDto dataColumnsDto) throws ItemNotFoundException {
        DataColumns dataColumns = new DataColumns();
        dataColumns.setName(dataColumnsDto.getName());
        dataColumns.setDescription(dataColumnsDto.getDescription());
        dataColumns.setConfiguration(dataColumnsDto.getConfiguration());

        if (dataColumnsDto.getClassId() != null) {
            DataClass dataClass = dataClassRepository.findByIdAndDeleted(dataColumnsDto.getClassId(), false);
            if (dataClass != null)
                dataColumns.setDataClass(dataClass);
            else
                throw new ItemNotFoundException(DataClass.class, dataColumnsDto.getClassId());
        }

        return columnsRepository.save(dataColumns);
    }

    public List<DataColumns> getColumns() {
        return columnsRepository.findAllByDeletedOrderById(false);
    }

    public List<DataColumns> getColumns(List<Long> ids) {
        return columnsRepository.findAllByDeletedAndIdIn(false, ids);
    }

    public DataColumns modifyColumns(DataColumnsDto dataColumnsDto) throws ItemNotFoundException, ModifyByNullEntityIdException {
        if (dataColumnsDto.getId() == null)
            throw new ModifyByNullEntityIdException(DataColumns.class);

        DataColumns dataColumns = columnsRepository.findByIdAndDeleted(dataColumnsDto.getId(), false);

        if (dataColumns == null)
            throw new ItemNotFoundException(DataColumns.class, dataColumnsDto.getId());

        dataColumns.setName(dataColumnsDto.getName());
        dataColumns.setDescription(dataColumnsDto.getDescription());
        dataColumns.setConfiguration(dataColumnsDto.getConfiguration());


        if (dataColumnsDto.getClassId() != null) {
            DataClass dataClass = dataClassRepository.findByIdAndDeleted(dataColumnsDto.getClassId(), false);
            if (dataClass != null)
                dataColumns.setDataClass(dataClass);
            else
                throw new ItemNotFoundException(DataClass.class, dataColumnsDto.getClassId());
        } else
            dataColumns.setDataClass(null);

        return columnsRepository.save(dataColumns);
    }

    public void deleteColumns(long columnsId) throws ItemNotFoundException {
        DataColumns columns = columnsRepository.findByIdAndDeleted(columnsId, false);

        if (columns == null)
            throw new ItemNotFoundException(DataColumns.class, columnsId);

        columns.setDeleted(true);
        columnsRepository.save(columns);
    }

}
